import React from "react";
import { ImageStyle, ScrollView, StyleProp, StyleSheet } from 'react-native';
import { Button, Colors, Constants, DateTimePicker, Text, TextField, View, Incubator } from "react-native-ui-lib";
import { FormikHelpers, useFormik } from "formik";
import { AntDesign } from "@expo/vector-icons";

import { ActivityEntity } from "../domain";
import { Activity } from "../domain/Activity.d";
import * as Colours from "../constants/colours";
import { normaliseSizeHorizontal, StatusBarHeight } from "../helpers/responsitivity";
import { DATE_FORMAT, TIME_FORMAT } from "../appSettings";


// TODO: remove all console debug statements
// TODO: declare type for props
export default function NewActivityScreen(props: unknown) {
  const formik = useFormik({
    validationSchema: ActivityEntity.validationSchema,
    initialValues: ActivityEntity.getDefault() as Activity,
    onSubmit(values: Activity, formikHelpers: FormikHelpers<Activity>) {
      const { resetForm } = formikHelpers;
      resetForm();
      console.debug(values);
    },
  });

  const {
    values, handleChange, handleBlur,
    errors, setFieldTouched, touched, isValid,
    handleSubmit, handleReset
  } = formik;

  // TODO: kick-start validations
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
            validationMessage={ errors.name }
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
            containerStyle={ { marginVertical: 20 } }
            placeholer='Select the held date'
          />
          <Text style={ { color: Colors.red20, alignSelf: 'flex-start', flexGrow: 0.2 } }>{ errors.date }</Text>
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
            containerStyle={ { marginVertical: 20 } }
            placeholer='Select the attended date'
          />
          <Text style={ { color: Colors.red20, alignSelf: 'flex-start', flexGrow: 0.2 } }>{ errors.attendedAt }</Text>
        </View>
        <TextField
          title={ "Reporter's Name (*)" }
          style={ { height: normaliseSizeHorizontal(30) } }
          value={ values.reporterName }
          error={ errors.reporterName }
          underlineColor={ !!errors.reporterName ? Colours.RED_VENETIAN : Colors.blue20 }
        />
      </ScrollView>
      {/* BUTTONS */ }
      <View
        key="action-buttons-area-wrapper"
        style={ styles.buttonContainer }
      >
        <Button
          label=' RESET'
          style={ { alignSelf: 'baseline', width: 30 + '%' } }
          onPress={ (event) => {
            handleReset(event);
            console.debug("default: ", formik.initialValues);
          } }
          backgroundColor={ Colors.grey30 }
          iconSource={ (iconStyles: StyleProp<ImageStyle>) => (
            <AntDesign name="reload1" color="white" { ...iconStyles }/>
          ) }
        />
        <Button
          style={ { alignSelf: 'baseline', width: 60 + '%' } }
          label=' CONFIRM'
          onPress={ handleSubmit }
          backgroundColor={ Colors.blue50 }
          iconSource={ (iconStyles: StyleProp<ImageStyle>) => (
            <AntDesign name="checkcircleo" color="white" { ...iconStyles }/>
          ) }
        />
      </View>
    </View>
  )
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
})