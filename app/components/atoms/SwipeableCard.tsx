import React, { ReactNode, ReactElement, MutableRefObject, useRef } from 'react';
import { Text, View } from 'react-native-ui-lib';
import { Animated, ColorValue, StyleSheet } from 'react-native';
import { juxt } from 'ramda';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Colours } from "../../constants";
import { RightActionProps, SwipableCardProps } from "../typings";


export default function SwipableCard(props: SwipableCardProps) {
  const { children, onMore, onMarked, onDeleted, hasRightActions } = props;
  const swipeableRowRef: MutableRefObject<Swipeable | null> = useRef(null);

  /* type AnimatedValue = [Number, Number]
     type ProgressAnimatedValue = ?Animated.Interpolation
                                | ?Animated.Value
     type DragAnimatedValue = Animated.Interpolation
     renderRightActions :: ( ProgressAnimatedValue = [0, 1]
                           , DragAnimatedValue = [0, -Infinity]
                           ) -> React.Node
     renderLeftActions :: ( ProgressAnimatedValue = [0, 1]
                          , DragAnimatedValue = [0, Infinity]
                          )  -> React.Node
  */
  return (
    <Swipeable
      childrenContainerStyle={styles.cardOuterContainer}
      ref={x => {
        swipeableRowRef.current = x
      }}
      friction={1}
      leftThreshold={15}
      rightThreshold={10}
      renderLeftActions={renderLeftActions}
      {...hasRightActions && { renderRightActions: renderRightActions }}
    >
      {children}
    </Swipeable>
  );

  function renderLeftActions(_: Animated.AnimatedInterpolation,
                             dragX: Animated.AnimatedInterpolation): React.ReactNode {
    const trans = dragX.interpolate({
      inputRange: [0, 60, 120],
      outputRange: [-2, 0, 1],
    });

    return (
      <Animated.View
        style={[
          styles.deleteActionBtnContainer,
          { transform: [{ translateX: trans }] }
        ]}
      >
        <RectButton
          {...!swipeableRowRef.current
            ? {}
            : { onPress: juxt([
                swipeableRowRef.current?.close,
                onDeleted
              ])
            }}
        >
          <AntDesign
            name='delete'
            size={20}
            color='white'
            style={styles.actionIcon}
          />
        </RectButton>
      </Animated.View>
    );
  }

  function renderRightActions(progress: any): ReactElement {
    return (
      <View
        style={{
          width: 100,
          flexDirection: 'row',
        }}
      >
        <RightAction
          colour='#440166'
          x={100}
          style={{ borderRadius: 10 }}
          onPressed={onMore}
        >
          <MaterialIcons
            name='more-horiz'
            size={24}
            color='white'
            style={{ padding: 10, marginRight: 1 }}
          />
        </RightAction>
        <RightAction
          colour={Colours.GREEN_ZELYONY}
          x={50}
          onPressed={onMarked}
        >
          <MaterialIcons
            name='done'
            size={20}
            color='white'
            style={{ padding: 10 }}
          />
        </RightAction>
      </View>
    );

    function RightAction({ text, colour, x, children, onPressed }: RightActionProps): ReactElement {
      const trans = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [x, 0],
        extrapolate: 'clamp'
      });

      return (
        <Animated.View
          style={{
            flex: 1,
            transform: [{
              translateX: trans
            }]
          }}
        >
          <RectButton
            style={[
              styles.rightActionContainer,
              { backgroundColor: colour },
              { borderRadius: 1 }
            ]}
            {...!swipeableRowRef.current
              ? {}
              : { onPress: juxt([
                  swipeableRowRef.current?.close,
                  onDeleted
                ])
              }}
          >
            {text ?
              ( <Text style={styles.actionText}>
                  {text}
                </Text>
              ) : children}
          </RectButton>
        </Animated.View>
      );
    }
  }
}

const styles = StyleSheet.create({
  cardOuterContainer: {
    flex: 1,
    height: 120,
    borderBottomWidth: 2,
    borderBottomColor: Colours.LAVENDER_LIGHT
  },
  deleteActionBtnContainer: {
    backgroundColor: Colours.RED_VENETIAN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    padding: 10
  },
  actionIcon: {
    padding: 20,
  },
  rightActionContainer: {
    flex: 1,
    backgroundColor: Colours.GREEN_ZELYONY,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
