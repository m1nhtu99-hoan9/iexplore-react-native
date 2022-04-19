import * as yup from "yup";
import { ValidationError } from "yup";

import { Activity } from "./Activity.d";
import { hashArray } from "react-hash-string";
import { toString } from "../helpers/dateTimeUtils";


export function getDefault() {
  const activityObj = {
    name: "Activity Name",
    location: undefined,
    date: new Date(),
    attendedAt: undefined as Date | undefined,
    reporterName: "John Doe"
  };
  activityObj.attendedAt = activityObj.date;

  return activityObj;
}


export const validationSchema = yup.object()
  .shape({
    name: yup.string()
      .matches(/^[a-zA-Z0-9\,\&\!\.\,\$\#\ ]{3,}$/,
        "Activity name must be in a single line and contain at least 3 characters. "
        + "Characters allowed: (A-Z), (a-z), (0-9), (&), (#), (!), ($), (,), (.)")
      .required("Activity name is required"),
    // where the activity have been held
    location: yup.string()
      .optional(),
    // when the activity will be held
    date: yup.date()
      .default(() => new Date())
      .required(),
    // time of attending
    attendedAt: yup.date()
      .optional(),  // allows `undefined`
    reporterName: yup.string()
      .matches(/^[a-zA-Z0-9\'\,\.\,\ ]{3,}$/,
        "Reporter's name must be in a single line and contain at least 3 characters. "
        + "Characters allowed: (A-Z), (a-z), (0-9), ('), (,), (.)")
      .required("Reporter's name is required"),
  })
;


export function getHash(activity: Activity) {
  if (!activity) {
    return undefined;
  }

  try {
    return hashArray([ activity.name, toString(activity.date) ]);
  }
  catch (err) {
    const newErr = err.constructor(`Unable to hash (${JSON.stringify(activity)}). Inner error:\n${err.message}`);
    if (err.stack) {
      newErr.stack = err.stack;
    }
    if (err.code) {
      newErr.code = err.code;
    }

    throw newErr;
  }
}


/**
 * @throws {ValidationError}
 */
export function from(value: object) {
  const activityObj = validationSchema.validateSync(value);

  return consolidate(activityObj);
}


/**
 * @throws {ValidationError}
 */
export async function fromAsync(value: object) {
  const activityObj = await validationSchema.validate(value);

  return consolidate(activityObj);
}


function consolidate(activityObj: Activity) {
  if (!activityObj.attendedAt) {
    activityObj.attendedAt = activityObj.date;
  }

  return activityObj;
}
