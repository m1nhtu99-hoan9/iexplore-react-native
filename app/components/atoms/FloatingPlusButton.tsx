import React from 'react';
import { StyleSheet } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';

import { Colours } from "../../constants";
import { FloatingPlusButtonProps } from "../typings";


export default function FloatingPlusButton ({ onPressed }: FloatingPlusButtonProps) {
  return (
    <BaseButton
      style={styles.iconContainer}
      rippleColor={Colours.WHITE}
      onPress={onPressed}
    >
      <AntDesign
        name='plus'
        size={32}
        color={Colours.WHITE}
      />
    </BaseButton>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: Colours.PURPLE1,
    opacity: 0.7,
    position: 'absolute',
    bottom: 15,
    right: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    height: 48,
    width: 48,
    zIndex: 3,
    elevation: 2,
  }
});
