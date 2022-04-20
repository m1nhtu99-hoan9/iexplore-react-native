import React, { useEffect, useState } from "react";
import { ListRenderItemInfo, Platform, StyleSheet } from "react-native";
import { View } from "react-native-ui-lib";
import { Divider, SearchBar } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";

import { ActivityEntityCardItem, FloatingPlusButton } from "../components";
import { Colours, ScreenNames } from "../constants";
import { ActivityModel } from "../domain";
import { useActivityDbServiceContext } from "../context/activityDbServiceContext";

import { HomeRouteName, ScreenProps } from "../navigation/typings";
import { IActivityDbService } from "../services/typings";
import { ActivityDbItem } from "../domain/Activity.d";


export default function HomeScreen({ navigation, route }: ScreenProps<HomeRouteName>) {
  const activityDbService = useActivityDbServiceContext() as IActivityDbService;
  const [ activities, setActivities ] = useState<readonly ActivityDbItem[]>([]);

  const [ searchPhrase, setSearchPhrase ] = useState("");

  // triggered at the first load
  useEffect(() => {
    setActivities(activityDbService.activities);
  }, []);

  useEffect(() => {
    navigation.setOptions({ title: `ALL ACTIVITIES (${ activities.length })` });
  }, [ navigation, activities ]);

  useEffect(() => {
    activityDbService.filter(searchPhrase)
      .then(results => {
        setActivities(results);
      });
  }, [ searchPhrase ]);

  return (
    <View flex>
      {/* @ts-ignore HACK: bypass `react-native-elements` misleading type declarations */ }
      <SearchBar
        platform={ Platform.select({ ios: "ios", android: "android", default: "default" }) }
        containerStyle={ styles.searchBarContainer }
        placeholder="Search by keyword"
        value={ searchPhrase }
        round={ true }
        /* @ts-ignore HACK: bypass `react-native-elements` misleading type declarations */
        onChangeText={ (text) => setSearchPhrase(text) }
        onClear={ () => setActivities(activityDbService.activities) }
      />
      <FlatList
        data={ activities }
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
        ItemSeparatorComponent={ _ => (
          <Divider orientation='horizontal' color={ Colours.DEEP_VIOLET } width={ 0.5 }/>
        ) }
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

const styles = StyleSheet.create({
  searchBarContainer: {
    marginVertical: 1 + '%',
    marginHorizontal: 0.5 + '%',
     borderColor: Colours.DEEP_VIOLET,
    borderWidth: 2,
    borderRadius: 10
  }
})