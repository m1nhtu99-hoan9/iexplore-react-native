import React, { useEffect, useState } from "react";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { FlatList, LogBox } from "react-native";
import { hashString } from "react-hash-string";

import { ErrorMessage, NewActivityConfirmationRouteName, ScreenProps } from "../navigation/typings";
import { Colours, ScreenNames } from "../constants";
import { toString, mergeDateTime } from "../helpers/dateTimeUtils";
import { Activity } from "../domain/Activity.d";
import { useActivityDbServiceContext } from "../context/activityDbServiceContext";
import { ActivityDbService } from "../services";

// HACK: to suppress a warning thrown by `react-navigation` to warn against
// navigation action params having too many nested object level.
LogBox.ignoreLogs([ "Non-serializable values were found in the navigation state" ]);

export default function NewActivityConfirmationScreen({ route, navigation }
                                                        : ScreenProps<NewActivityConfirmationRouteName>) {
  const activityDbService = useActivityDbServiceContext() as ActivityDbService;
  const { payload, status } = route.params;

  const [ addedActivityId, setAddedActivityId ] = useState<number | undefined>(undefined);

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

  function onAddThisActivityBtnPressed() {
    activityDbService.add(payload)
      .then(id => setAddedActivityId(id));
  }

  return (
    <View spread flex>
      <View marginT-20 marginH-20>
        { status === 'SUCCEEDED' ? ( <SucceededContent payload={ payload as Activity }/> ) : null }
        { status === 'WARNING' ? ( <WarningContent payload={ payload as ErrorMessage[] }/> ) : null }
      </View>
      { status === 'SUCCEEDED' ? (
        <View margin-20 right>
          <Button
            text60
            link
            label="Add this Activity >>>"
            onPress={ onAddThisActivityBtnPressed }
          />
        </View>
      ) : null }
    </View>
  );

  //#region internal functional components

  function SucceededContent(props: { payload: Activity }) {
    const { name, location, date, time, attendedAt, reporterName } = props.payload;
    const dateTime = mergeDateTime(date, time);

    return (
      <View margin-20>
        <Text>{ `Activity Name: ${ represent(name) }` }</Text>
        <Text>{ `Location: ${ represent(location) }` }</Text>
        <Text>{ `Date & Time of Attending: ${ represent(dateTime) }` }</Text>
        <Text>{ `Reporter's Name: ${ represent(reporterName) }` }</Text>
        { addedActivityId === undefined
          ? null
          : (
            <Text
              style={ { color: !addedActivityId ? Colours.RED_VENETIAN : Colours.GREEN_ZELYONY } }
            >
              { !!addedActivityId ? "Activity created successfully" : "Activity not saved" }
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
          keyExtractor={ (msg, i) => ( hashString(msg) + i ).toString() }
        />
      </View>
    );
  }

  //#endregion
}


function represent(value: string | Date | undefined) {
  if (!value) {
    return "<N/A>";
  }
  if (value instanceof Date) {
    return toString(value as Date);
  }
  return value.toString();
}