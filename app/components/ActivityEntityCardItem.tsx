import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-ui-lib";
import { RectButton } from "react-native-gesture-handler";
import * as R from "ramda";

import { SwipableCard } from "./atoms";
import { Colours } from "../constants";
import { ActivityEntityCardItemProps } from "./typings";
import { Activity } from "../domain/Activity.d";
import { toString } from "../helpers/dateTimeUtils";
import { normalise } from "../helpers/responsitivity";


export default function ActivityEntityCardItem({ item, onEditBtnPressed, onMoreBtnPressed, onDeleteBtnPressed }
                                                 : ActivityEntityCardItemProps) {
  const { activityId } = item;

  return (
    <SwipableCard
      hasRightActions={ true }
      onMore={ onMoreBtnPressed }
      onMarked={ onEditBtnPressed }
      onDeleted={ onDeleteBtnPressed }
    >
      <RectButton
        style={ styles.container }
        onPress={ onMoreBtnPressed }
      >
        <Text
          numberOfLines={ 2 }
          ellipsizeMode='tail'
          style={ styles.contentTxt }
        >
          { buildCardContent(item) }
        </Text>
        <Text style={ styles.subContentTxt }>
          { buildCardSubContent(item) } &gt;
        </Text>
      </RectButton>
    </SwipableCard>
  )
}

function buildCardContent(item: Activity) {
  const { name, location, date } = item;
  const content = `${ name } (${ toString(date) })`;

  if (!R.not(location)) {
    return content + ` in ${ location }`;
  }
  return content;
}

function buildCardSubContent(item: Activity) {
  const { attendedAt, reporterName } = item;
  const content = `Reported by ${ reporterName }`;

  if (!R.not(attendedAt)) {
    return content + ` at ${ toString(attendedAt as Date) }`;
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 80,
    paddingVertical: 20,
    paddingHorizontal: 5,
    backgroundColor: Colours.WHITE,
    elevation: 5
  },
  contentTxt: {
    paddingLeft: 2 + '%',
    marginRight: 80,
    fontSize: normalise(18),
    color: Colours.GREEN_ZELYONY,
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },
  subContentTxt: {
    position: 'absolute',
    right: 2 + '%',
    top: 0,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  }
});