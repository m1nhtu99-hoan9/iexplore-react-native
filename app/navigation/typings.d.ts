import { ParamListBase, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Activity } from "../domain/Activity";

export type ValidationStatus = 'SUCCEEDED' | 'WARNING';
export type ErrorMessage = string;

export type HomeRouteName = keyof RootStackParamList  & "Home";
export type NewActivityRouteName = keyof RootStackParamList & "NewActivity";
export type NewActivityConfirmationRouteName = keyof RootStackParamList & "NewActivityConfirmation";

export type RootStackParamList = ParamListBase & {
  Home: undefined,
  NewActivity: undefined,
  NewActivityConfirmation: {
    payload: Activity | ErrorMessage[],
    status: ValidationStatus
  }
}

export type ScreenProps<TRouteName> = NativeStackScreenProps<RootStackParamList, TRouteName>;