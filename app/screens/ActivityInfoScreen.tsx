import React from "react";
import { ScrollView, StyleSheet } from 'react-native';
import { Text, View } from "react-native-ui-lib";
import { isNil } from "ramda";

import { ActivityInfoRouteName, ScreenProps } from "../navigation/typings";
import { Colours } from "../constants";
import { normalise, StatusBarHeight } from "../helpers/responsitivity";
import { mergeDateTime, toString } from "../helpers/dateTimeUtils";

export default function ActivityInfoScreen({ route }: ScreenProps<ActivityInfoRouteName>) {
  const { activityId, name, location, date, time, reporterName, reportContent } = route.params.payload;
  const dateTime = mergeDateTime(date, time);

  return (
    <ScrollView style={ styles.scrollViewContainer }
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
            key="activity-date-time-region-wrapper">
        <Text uppercase style={ styles.headerText }>
          Date & Time:
        </Text>
        <Text text60 style={ styles.infoText }>
          { represent(dateTime) }
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
      <View style={ { justifyContent: 'center' } }
            key="activity-report-content-region-wrapper">
        <Text uppercase style={ styles.headerText }>
          Report Content:
        </Text>
        <Text text60 style={ styles.infoText }>
          { represent(reportContent) }
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
  scrollViewContainer: {
    margin: 1 + '%',
    backgroundColor: Colours.WHITE,
  },
  regionContainer: {
    height: 20 + '%',
    justifyContent: 'center'
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