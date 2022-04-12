import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AddNewActivityStackNavigator } from "./stackNavigators";
import { ScreenNames } from '../constants';

export default function AppNavigationContainer() {
  return (
    <NavigationContainer>
      <AddNewActivityStackNavigator
        initialRouteName={ScreenNames.Home}
      />
    </NavigationContainer>
  )
}