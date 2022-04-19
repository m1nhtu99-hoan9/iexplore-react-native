import React, { useEffect, useState } from "react";
import { ListRenderItemInfo } from "react-native";
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

  // triggered at the first load
  useEffect(() => {
    setActivities(activityDbService.activities);
  });

  useEffect(() => {
    console.debug("[HomeScreen.useEffect] entered.");

    navigation.setOptions({ title: `ALL ACTIVITIES (${ activities.length })` });
  }, [ navigation, activities ]);

  return (
    <View flex>
      <FlatList
        data={ activityDbService.activities }
        renderItem={ ({ item }: ListRenderItemInfo<ActivityDbItem>) => (
          <ActivityEntityCardItem
            item={ item }
            onMoreBtnPressed={ onActivityMoreBtnPressed(item) }
            onEditBtnPressed={ onActivityEditBtnPressed(item) }
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

  //#region internal functions

  function onActivityEditBtnPressed(activity: ActivityDbItem) {
    return () => {
      navigation.push(ScreenNames.EditActivity, { payload: activity });
    };
  }

  function onActivityMoreBtnPressed(activity: ActivityDbItem) {
    return () => {
      navigation.push(ScreenNames.ActivityInfo, { payload: activity });
    };
  }

  function onActivityDeleteBtnPressed(activityId: number) {
    return () => {
      activityDbService.delete(activityId)
        .then(isOk => {
          if (isOk) {
            setActivities(activityDbService.activities);
          }
        })
        .catch(e => {
          console.error(`[HomeScreen.onActivityDeleteBtnPressed] Deleting action failed to be completed. Error:\n${ e.message }`);
        });
    };
  }

  //#endregion
}