import React, { useEffect, useLayoutEffect, useState } from "react";
import { View } from "react-native-ui-lib";
import { FlatList } from "react-native-gesture-handler";
import * as R from "ramda";

import { HomeRouteName, ScreenProps } from "../navigation/typings";
import { ActivityEntityCardItem, FloatingPlusButton } from "../components";
import { ScreenNames } from "../constants";
import { ActivityModel } from "../domain";
import { useActivityDbServiceContext } from "../context/activityDbServiceContext";
import { ActivityDbService } from "../services";
import { ActivityDbItem } from "../domain/Activity.d";


export default function HomeScreen({ navigation, route }: ScreenProps<HomeRouteName>) {
  const activityDbService = useActivityDbServiceContext() as ActivityDbService;
  const [ activities, setActivities ] = useState(activityDbService.activities);

  useEffect(() => {
    console.debug("[HomeScreen.useEffect] entered.");

    navigation.setOptions({ title: `ALL ACTIVITIES (${ activities.length })` });
  }, [ navigation, activities ]);

  function onActivityDeleteBtnPressed(activityId: number) {
    return () => {
      activityDbService.delete(activityId)
        .then(isOk => {
          if (isOk) {
            setActivities(activityDbService.activities);
          }
        })
        .catch(e => {
          console.error(`[HomeScreen.onActivityDeleteBtnPressed] Delete action failed to be completed. Error:\n${ e.message }`);
        });
    }
  }

  return (
    <View flex>
      <FlatList
        data={ activityDbService.activities }
        renderItem={ ({ item }) => (
          <ActivityEntityCardItem
            item={ item }
            onMoreBtnPressed={ () => console.log("Not implemented yet.") }
            onEditBtnPressed={ () => console.log("To be implemented.") }
            onDeleteBtnPressed={ onActivityDeleteBtnPressed(item.activityId) }
          />
        ) }
        keyExtractor={ (item: ActivityDbItem) => {
          return `${ item.activityId }_${ ActivityModel.getHash(item) }`;
        } }
      />
      <FloatingPlusButton
        onPressed={ () => navigation.push(ScreenNames.NewActivity) }
      />
    </View>
  );
}