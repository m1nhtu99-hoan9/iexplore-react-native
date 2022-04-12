import { Dimensions, Platform, PlatformIOSStatic, StatusBar } from "react-native";

const IPHONE7_SCREEN_WIDTH = 736;
const IPHONE5_SCREEN_WIDTH = 350;
const IPHONE5_SCREEN_HEIGHT = 350;

export const StatusBarHeight = Platform.select({
  ios: ( Dimensions.get('window').width > IPHONE7_SCREEN_WIDTH
         && !( Platform as PlatformIOSStatic ).isTVOS
         && !( Platform as PlatformIOSStatic ).isPad )
    ? 44
    : 20,
  android: StatusBar.currentHeight,
  default: 0
});

export function normaliseSizeVertical(n: number): number {
  return Dimensions.get('window').width / IPHONE5_SCREEN_WIDTH * n;
}

export function normaliseSizeHorizontal(n: number): number {
  return Dimensions.get('window').width / IPHONE5_SCREEN_WIDTH * n;
}

export function normalise (n: number, factor = 0.5): number {
  return n + ( normaliseSizeVertical(n) - n ) * factor;
}