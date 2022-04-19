import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityStackNavigator } from "./stackNavigators";
import { ScreenNames } from '../constants';

export default function AppNavigationContainer() {
  return (
    <NavigationContainer>
      <ActivityStackNavigator
        initialRouteName={ScreenNames.Home}
      />
    </NavigationContainer>
  )
}