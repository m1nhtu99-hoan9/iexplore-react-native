import React from "react";
import { ScrollView, StyleSheet } from 'react-native';
import { Text, View } from "react-native-ui-lib";

import { ActivityInfoRouteName, ScreenProps } from "../navigation/typings";
import { Colours } from "../constants";
import { normalise, StatusBarHeight } from "../helpers/responsitivity";
import { toString } from "../helpers/dateTimeUtils";

export default function ActivityInfoScreen({ route }: ScreenProps<ActivityInfoRouteName>) {
  const { activityId, name, location, date, attendedAt, reporterName } = route.params.payload;

  return (
    <ScrollView style={ styles.container }
                contentContainerStyle={ styles.containerContent }
    >
      <View style={ styles.regionContainer }
            key="activity-name-region-wrapper">
        <Text uppercase
              style={ styles.headerText }>
          Activity Name:
        </Text>
        <Text
          style={ [ { fontSize: normalise(26), fontWeight: "bold" }, styles.infoText ] }
        >
          { represent(name) }
        </Text>
      </View>
      <View style={ styles.regionContainer }
            key="activity-location-region-wrapper">
        <Text uppercase style={ styles.headerText }
        >
          Location:
        </Text>
        <Text text60 style={ styles.infoText }>
          { represent(location) }
        </Text>
      </View>
      <View style={ styles.regionContainer }
            key="activity-date-region-wrapper">
        <Text uppercase style={ styles.headerText }>
          Date:
        </Text>
        <Text text60 style={ styles.infoText }>
          { represent(date) }
        </Text>
      </View>
      <View style={ styles.regionContainer }
            key="activity-reporter-name-region-wrapper">
        <Text uppercase style={ styles.headerText }>
          Reported By:
        </Text>
        <Text text60 style={ styles.infoText }>
          { represent(reporterName) }
        </Text>
      </View>
      <View style={ styles.regionContainer }
            key="activity-attended-at-region-wrapper">
        <Text uppercase style={ styles.headerText }>
          Attended At:
        </Text>
        <Text text60 style={ styles.infoText }>
          { represent(attendedAt) }
        </Text>
      </View>
    </ScrollView>
  );
}

function represent(value: string | Date | undefined) {
  if (!value) {
    return "<N/A>";
  }
  if (value instanceof Date) {
    return toString(value as Date);
  }
  return value.toString();
}

const styles = StyleSheet.create({
  container: {
    margin: 1 + '%',
    backgroundColor: Colours.WHITE,
  },
  regionContainer: {
    height: 20 + '%',
    justifyContent: "center"
  },
  containerContent: {
    marginLeft: 1 + '%',
    marginBottom: StatusBarHeight,
    flexGrow: 1
  },
  headerText: {
    fontSize: normalise(14),
    paddingBottom: 1.5 + '%',
  },
  infoText: { color: Colours.DEEP_VIOLET }
});