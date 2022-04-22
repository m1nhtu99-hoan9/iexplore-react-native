import { useState } from "react";
import { isNil, isEmpty, either, pipe, trim } from "ramda";
import { Colors } from "react-native-ui-lib";


const isNullOrWhitespace = either(isNil, pipe(trim, isEmpty));

export default function useTxtBorderLineColour(options?: TxtBorderLineColourOptions)
  : [BorderLineColour, OnFocusBorderLineColour, OnBlurBorderLineColour] {
  const colourBlur = isNullOrWhitespace(options?.colourOnBlur) ? Colors.grey50 : options!.colourOnBlur!;
  const colourFocus = isNullOrWhitespace(options?.colourOnFocus) ? Colors.blue20 : options!.colourOnFocus!;

  const [ borderLineColour, setBorderlineColour ] = useState<string>(colourFocus);

  function setColourOnFocus() {
    setBorderlineColour(colourFocus);
  }

  function setColourOnBlur() {
    setBorderlineColour(colourBlur);
  }

  return [ borderLineColour, setColourOnFocus, setColourOnBlur ];
}