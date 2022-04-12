import React, { useEffect, useLayoutEffect, useState } from "react";
import { View } from "react-native-ui-lib";
import * as R from "ramda";

import { HomeScreenProps } from "../navigation/typings";
import { Activity } from "../domain/Activity.d";
import { FloatingPlusButton } from "../components";
import { ScreenNames } from "../constants";


export default function HomeScreen({ navigation, route }: HomeScreenProps) {
  const [ activities, setActivities ] = useState<Activity[]>([]);

  useLayoutEffect(() => {
    // TODO: reload all list of activities
    /*
    fetchApartmentsAndDebug()
      .then(_ => {
        navigation.setOptions({ title: `ALL ACTIVITIES (${activities.length})` });
      });
      */
  }, [ navigation ]);

  useEffect(() => {
    /*
    fetchApartmentsAndDebug()
      .then(_ => {
        navigation.setOptions({ title: `ALL ACTIVITIES (${activities.length})` });
      });
      */
  }, []);

  // TODO: display activity info cards inside View
  return (
    <View flex>
      <FloatingPlusButton
        onPressed={ () => navigation.push(ScreenNames.NewActivity) }
      />
    </View>
  );
}