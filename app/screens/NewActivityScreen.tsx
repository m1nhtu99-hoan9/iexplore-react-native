import React from "react";
import { ImageStyle, ScrollView, StyleProp, StyleSheet, LogBox } from 'react-native';
import { Button, Colors, Constants, DateTimePicker, Text, TextField, View, Incubator } from "react-native-ui-lib";
import { FormikHelpers, useFormik } from "formik";
import { AntDesign } from "@expo/vector-icons";
import * as R from "ramda";

import { ActivityModel } from "../domain";
import { Activity } from "../domain/Activity.d";
import { normaliseSizeHorizontal, StatusBarHeight } from "../helpers/responsitivity";
import { DATE_FORMAT, TIME_FORMAT } from "../appSettings";
import { ErrorMessage, NewActivityRouteName, ScreenProps } from "../navigation/typings";
import { Colours, ScreenNames } from "../constants";

// HACK: to suppress a warning thrown by `react-navigation` to warn against
// navigation action params having too many nested object level.
LogBox.ignoreLogs([ "Non-serializable values were found in the navigation state" ]);

export default function NewActivityScreen({ route, navigation }: ScreenProps<NewActivityRouteName>) {
  const formik = useFormik({
    validationSchema: ActivityModel.validationSchema,
    initialValues: ActivityModel.getDefault() as Activity,
    onSubmit(values: Activity, _) {
      console.debug("[NewActivityScreen] Submission data: ");
      console.debug(values);
    }
  });

  const {
    values, handleChange, handleBlur,
    errors, isValid, handleSubmit, handleReset
  } = formik;

  function onSubmitBtnPressed() {
    const errorMessages = R.pipe(R.values, R.reject(R.not))(errors) as ErrorMessage[];
    navigation.push(ScreenNames.NewActivityConfirmation,
      R.length(errorMessages) !== 0
      ? ( { payload: errorMessages, status: 'WARNING' } )
      : ( { payload: ActivityModel.consolidate(values as Activity), status: 'SUCCEEDED' } ));
  }

  return (
    <View flex style={ { backgroundColor: Colors.white } }>
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={ styles.scrollViewContainer }
        contentContainerStyle={ styles.containerContent }
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
            value={ values.location ?? undefined }
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
        <View key="activity-event-timepicker-wrapper"
              style={ { height: 20 + '%', marginBottom: StatusBarHeight, justifyContent: 'flex-start' } }
        >
          <DateTimePicker
            title='Time of Attending'
            mode='time'
            timeFormat={ TIME_FORMAT }
            titleStyle={ { color: Colors.black } }
            style={ { fontSize: 14, flexGrow: 0.8 } }
            placeholder='Touch to set the time'
            dialogProps={ { title: 'Time of Attending?' } }
            placeholer='Select the time of attending'
            value={ values['time'] }
            onChangeText={ handleChange('time') }
          />
          <Text style={ styles.dateTimeErrorTextArea }>{ errors.time ?? '' }</Text>
        </View>
        <View style={ { height: 20 + '%' } }
              key="activity-reporter-name-text-area-wrapper">
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
            onSubmitBtnPressed();
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
  scrollViewContainer: {
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
  textAreaContainer: {
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