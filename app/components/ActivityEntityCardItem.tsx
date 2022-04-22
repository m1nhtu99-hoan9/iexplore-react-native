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
import { normalise, normaliseSizeVertical } from "../helpers/responsitivity";


export default function ActivityEntityCardItem({ item, onEditBtnPressed, onMoreBtnPressed, onDeleteBtnPressed }
                                                 : ActivityEntityCardItemProps) {
  const { activityId } = item;

  return (
    <SwipableCard
      hasRightActions={ true }
      onMorePressed={ onMoreBtnPressed }
      onEditPressed={ onEditBtnPressed }
      onDeletePressed={ onDeleteBtnPressed }
    >
      <RectButton
        style={ styles.scrollViewContainer }
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
  scrollViewContainer: {
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
    marginTop: normaliseSizeVertical(18),
    marginLeft: 1 + '%',
    marginRight: 1 + '%',
    fontSize: normalise(18),
    color: Colours.GREEN_ZELYONY,
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },
  subContentTxt: {
    position: 'absolute',
    top: normaliseSizeVertical(5),
    right: 2 + '%',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  }
});