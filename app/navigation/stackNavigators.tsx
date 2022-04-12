import React from 'react';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigatorProps } from "react-native-screens/lib/typescript/native-stack/types";

import { ScreenNames } from "../constants";     // !!TODO
import { NewActivityScreen } from "../screens";
import { RootStackParamList } from './typings'; // !!TODO
import HomeScreen from "../screens/HomeScreen";

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

    </Stack.Navigator>
  );

  /* TODO:
      <Stack.Screen name={ _confirmation screen name_ }
                    component={ _JSX screen component_ }
                    options={ ({ route }) => ({
                      title: route.params.mode === 'succeeded' ? 'CONFIRM YOUR INPUT' : 'VALIDATION ERRORS',
                      headerBackVisible: true
                    }) }
      />
  */
}