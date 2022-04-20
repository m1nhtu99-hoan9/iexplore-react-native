import React from "react";
import { ImageStyle, ScrollView, StyleProp, StyleSheet, LogBox } from 'react-native';
import { Button, Colors, Constants, DateTimePicker, Text, TextField, View, Incubator } from "react-native-ui-lib";
import { useFormik } from "formik";
import { AntDesign } from "@expo/vector-icons";

import { ActivityModel } from "../domain";
import { Activity } from "../domain/Activity.d";
import { normaliseSizeHorizontal, StatusBarHeight } from "../helpers/responsitivity";
import { DATE_FORMAT } from "../appSettings";
import { EditActivityRouteName, ScreenProps } from "../navigation/typings";
import { Colours, ScreenNames } from "../constants";
import { useActivityDbServiceContext } from "../context/activityDbServiceContext";
import { ActivityDbService } from "../services";

// HACK: to suppress a warning thrown by `react-navigation` to warn against
// navigation action params having too many nested object level.
LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

export default function EditActivityScreen({ route, navigation }: ScreenProps<EditActivityRouteName>) {
  const activityDbService = useActivityDbServiceContext() as ActivityDbService;
  const { payload } = route.params;

  const formik = useFormik({
    validationSchema: ActivityModel.validationSchema,
    initialValues: payload,
    onSubmit(values: Activity, _) {
      console.debug("[EditActivityScreen] Submission data: ");
      console.debug(values);

      const consolidatedActivity = ActivityModel.consolidate(values);
      console.debug("[EditActivityScreen] After consolidation: ");
      console.debug(consolidatedActivity);

      activityDbService.update(payload.activityId, consolidatedActivity)
        .then(updated => {
          if (updated) {
            console.debug("[EditActivityScreen] Changes saved to the database successfully.");

            navigation.reset({
              index: 0,
              routes: [ {
                name: ScreenNames.Home
              }]
            });
          }
        })
        .catch(e => {
          e.message = `[EditActivityScreen] Error occurred while processing database update:\n${e.message}`;
          throw e;
        });
    },
  });

  const {
    values, handleChange, handleBlur,
    errors, isValid, handleSubmit, handleReset
  } = formik;

  return (
    <View flex style={ { backgroundColor: Colors.white } }>
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={ styles.container }
        contentContainerStyle={ { padding: 1 + '%', flexGrow: 1 } }
        keyboardDismissMode='on-drag'
      >
        <View style={ { height: 20 + '%' } }
              key="activity-name-text-area-wrapper">
          <Incubator.TextField
            placeholder="Activity Name (*)"
            floatingPlaceholderStyle={ styles.textAreaFloatingPlaceholder }
            floatingPlaceholder
            style={ { height: normaliseSizeHorizontal(30) } }
            enableErrors
            validationMessagePosition={ Incubator.TextField.validationMessagePositions.BOTTOM }
            validationMessage={ errors.name ?? '' }
            value={ values.name }
            onChangeText={ handleChange('name') }
            onBlur={ handleBlur('name') }
            fieldStyle={ styles.textAreaUnderline }
          />
        </View>
        <View style={ { height: 20 + '%' } }
              key="activity-location-text-area-wrapper">
          <Incubator.TextField
            placeholder="Location"
            floatingPlaceholderStyle={ styles.textAreaFloatingPlaceholder }
            floatingPlaceholder
            style={ { height: normaliseSizeHorizontal(30) } }
            enableErrors
            validationMessagePosition={ Incubator.TextField.validationMessagePositions.BOTTOM }
            validationMessage={ errors.location }
            value={ values.location }
            onChangeText={ handleChange('location') }
            onBlur={ handleBlur('location') }
            fieldStyle={ styles.textAreaUnderline }
          />
        </View>
        <View style={ { height: 20 + '%' } }
              key="activity-event-datepicker-wrapper">
          <DateTimePicker
            title='Event Date (*)'
            mode='date'
            dateFormat={ DATE_FORMAT }
            titleStyle={ { color: Colors.black } }
            style={ { fontSize: 14 } }
            placeholder='Touch to select a date'
            dialogProps={ { title: 'When is the activity event held?' } }
            placeholer='Select the held date'
            value={ values.date }
            onChangeText={ handleChange('date') }
          />
          <Text style={ styles.dateTimeErrorTextArea }>{ errors.date ?? '' }</Text>
        </View>
        <View flex key="activity-attended-datepicker-wrapper"
              style={ { height: 20 + '%', marginBottom: StatusBarHeight, justifyContent: 'flex-start' } }
        >
          <DateTimePicker
            title='Attended at?'
            mode='date'
            dateFormat={ DATE_FORMAT }
            titleStyle={ { color: Colors.black } }
            style={ { fontSize: 14, flexGrow: 0.8 } }
            placeholder='Touch to set the time'
            dialogProps={ { title: 'Attended at when?' } }
            placeholer='Select the attended date'
            value={ values.attendedAt }
            onChangeText={ handleChange('attendedAt') }
          />
          <Text style={ styles.dateTimeErrorTextArea }>{ errors.attendedAt ?? '' }</Text>
        </View>
        <View style={ { height: 20 + '%' } }
              key="activity-report-name-text-area-wrapper">
          <Incubator.TextField
            placeholder="Reporter's name (*)"
            floatingPlaceholderStyle={ styles.textAreaFloatingPlaceholder }
            floatingPlaceholder
            style={ { height: normaliseSizeHorizontal(30) } }
            enableErrors
            validationMessagePosition={ Incubator.TextField.validationMessagePositions.BOTTOM }
            validationMessage={ errors.reporterName }
            value={ values.reporterName }
            onChangeText={ handleChange('reporterName') }
            onBlur={ handleBlur('reporterName') }
            fieldStyle={ styles.textAreaUnderline }
          />
        </View>
      </ScrollView>
      <View
        key="action-buttons-area-wrapper"
        style={ styles.buttonContainer }
      >
        <Button
          label=' RESET'
          style={ { alignSelf: 'baseline', width: 30 + '%' } }
          onPress={ handleReset }
          backgroundColor={ Colors.grey30 }
          iconSource={ (iconStyles: StyleProp<ImageStyle>) => (
            <AntDesign name="reload1" color="white" { ...iconStyles }/>
          ) }
        />
        <Button
          style={ { alignSelf: 'baseline', width: 60 + '%' } }
          label=' CONFIRM'
          onPress={ (e) => {
            handleSubmit(e);
          } }
          backgroundColor={ Colors.blue50 }
          iconSource={ (iconStyles: StyleProp<ImageStyle>) => (
            <AntDesign name="checkcircleo" color="white" { ...iconStyles }/>
          ) }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 1 + '%',
    backgroundColor: Colours.WHITE,
  },
  containerContent: {
    padding: 1 + '%',
    flexGrow: 1
  },
  textAreaFloatingPlaceholder: {
    color: Colors.black,
    fontSize: 12
  },
  textAreaUnderline: {
    borderBottomWidth: 1,
    borderColor: Colors.blue20,
    paddingBottom: 4
  },
  textAreaWrapper: {
    height: normaliseSizeHorizontal(100),
    borderWidth: 1,
    marginBottom: normaliseSizeHorizontal(10),
  },
  dateTimeErrorTextArea: {
    color: Colors.red20,
    alignSelf: 'flex-start',
    flexGrow: 0.2
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 1 + '%',
    marginTop: 1 + '%'
  },
  roundedDialog: {
    backgroundColor: Colors.white,
    marginBottom: Constants.isIphoneX ? 0 : StatusBarHeight,
    borderRadius: 12
  }
});