import React from 'react';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigatorProps } from "react-native-screens/lib/typescript/native-stack/types";
import { RouteProp } from '@react-navigation/native';

import { ScreenNames } from "../constants";
import { HomeScreen, NewActivityScreen, NewActivityConfirmationScreen } from "../screens";
import { NewActivityConfirmationRouteName, RootStackParamList } from './typings';

enableScreens()
const Stack = createNativeStackNavigator<RootStackParamList>();

export function AddNewActivityStackNavigator(props: Partial<NativeStackNavigatorProps>) {
  return (
    <Stack.Navigator { ...props }>
      <Stack.Screen name={ ScreenNames.Home }
                    component={ HomeScreen }
      />
      <Stack.Screen name={ ScreenNames.NewActivity }
                    component={ NewActivityScreen }
                    options={ { title: "Add New Activity" } }
      />
      <Stack.Screen name={ ScreenNames.NewActivityConfirmation }
                    component={ NewActivityConfirmationScreen }
                    options={({ route }) => createConfirmationScreenOptions(route)}
                    />
    </Stack.Navigator>
  );
}

function createConfirmationScreenOptions(route: RouteProp<RootStackParamList, NewActivityConfirmationRouteName>) {
  const { params } = route;
  const { status } = params;

  const statusTitleMappings = {
    ['SUCCEEDED']: "CONFIRM YOUR INPUTS",
    ['WARNING']: "VALIDATION ERRORS"
  };

  return {
    title: statusTitleMappings[status],
    headerBackVisible: true
  }
}