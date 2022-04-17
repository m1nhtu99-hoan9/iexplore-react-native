import React, { useEffect, useState } from "react";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { FlatList } from "react-native";
import { WebSQLDatabase } from "expo-sqlite";
import { hashString } from "react-hash-string";
import { formatISO } from "date-fns";

import {
  ErrorMessage, HomeRouteName,
  NewActivityConfirmationRouteName, ScreenProps
} from "../navigation/typings";
import { Colours, ScreenNames } from "../constants";
import { Activity } from "../domain/Activity.d";
import { useDbConnectionContext } from "../context/dbConnectionContext";
import { addNewActivity } from "../persistence/activityCommands";

export default function NewActivityConfirmationScreen({ route, navigation }
                                                        : ScreenProps<NewActivityConfirmationRouteName>) {
  const { payload, status } = route.params;
  const db = useDbConnectionContext() as WebSQLDatabase;

  const [ addedActivityId, setAddedActivityId ] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    if (addedActivityId === undefined) {
      return;
    }

    if (addedActivityId != null) {
      navigation.reset({
        index: 0,
        routes: [ {
          name: ScreenNames.Home,
        } ]
      });
    }
  }, [ addedActivityId ]);

  return (
    <View spread flex>
      <View marginT-20 marginH-20>
        { status === 'SUCCEEDED' ? (<SucceededContent payload={ payload as Activity }/>) : null }
        { status === 'WARNING' ? (<WarningContent payload={ payload as ErrorMessage[] }/>) : null }
      </View>
      { status === 'SUCCEEDED' ? (
        <View margin-20 right>
          <Button
            text60
            link
            label="Add this Activity >>>"
            onPress={ () => setAddedActivityId(saveNewActivityToDb(db, payload as Activity)) }
          />
        </View>
      ) : null }
    </View>
  );

  function SucceededContent(props: { payload: Activity }) {
    const { name, location, date, attendedAt, reporterName } = props.payload;

    return (
      <View margin-20>
        <Text>{ `Activity Name: ${ toString(name) }` }</Text>
        <Text>{ `Location: ${ toString(location) }` }</Text>
        <Text>{ `Date: ${ toString(date) }` }</Text>
        <Text>{ `Reporter's Name: ${ toString(reporterName) }` }</Text>
        <Text>{ `Attended At: ${ toString(attendedAt) }` }</Text>
        { addedActivityId === undefined
          ? null
          : (
            <Text
              style={ { color: !addedActivityId ? Colours.RED_VENETIAN : Colours.GREEN_ZELYONY } }
            >
              { !!addedActivityId ? "Apartment created successfully" : "Apartment not saved" }
            </Text>
          ) }
      </View>
    );
  }

  function WarningContent(props: { payload: ErrorMessage[] }) {
    return (
      <View margin-20>
        <Text style={ { fontWeight: 'bold', fontSize: 16 } }>
          The following validation errors need to be addressed:
        </Text>
        <FlatList
          data={ props.payload }
          renderItem={ ({ item }) => (
            <Text style={ { fontSize: 14, color: Colors.red30 } }>{ item }</Text>
          ) }
          keyExtractor={ (msg, i) => (hashString(msg) + i).toString() }
        />
      </View>
    )
  }
}

function saveNewActivityToDb(db: WebSQLDatabase, activityEntity: Activity) {
  const addedActivityId = addNewActivity(db, activityEntity);

  if (!addedActivityId) {
    console.error("Failed to add this activity to the database.");
  }

  return addedActivityId;
}

function toString(value: string | Date | undefined) {
  if (!value) {
    return "<N/A>";
  }
  if (value instanceof Date) {
    return formatISO(value as Date);
  }
  return value.toString();
}