import * as yup from "yup";
import { ValidationError } from "yup";
import { isNil } from "ramda";
import { hashArray } from "react-hash-string";

import { Activity } from "./Activity.d";
import { extractDateOnly, toString } from "../helpers/dateTimeUtils";


export function getDefault() {
  return {
    name: "Activity Name",
    location: undefined,
    date: extractDateOnly(),
    time: undefined,
    reporterName: "John Doe"
  };
}


export const validationSchema = yup.object()
  .shape({
    name: yup.string()
      .matches(/^[a-zA-Z0-9\,\&\!\.\,\$\#\ ]{3,}$/,
        "Activity name must be in a single line and contain at least 3 characters. "
        + "Characters allowed: (A-Z), (a-z), (0-9), (&), (#), (!), ($), (,), (.)")
      .required("Activity name is required"),
    // where the activity is held
    location: yup.string()
      .optional(),  // allows `undefined`
    // date when the activity is held
    date: yup.date()
      .default(() => extractDateOnly())
      .required(),
    // time of attending
    time: yup.date()
      .optional(),  // allows `undefined`
    // reporter's name
    reporterName: yup.string()
      .matches(/^[a-zA-Z0-9\'\,\.\,\ ]{3,}$/,
        "Reporter's name must be in a single line and contain at least 3 characters. "
        + "Characters allowed: (A-Z), (a-z), (0-9), ('), (,), (.)")
      .required("Reporter's name is required"),
    // content of the reporter's report
    reportContent: yup.string().optional()
  })


export function getHash(activity: Activity) {
  if (!activity) {
    return undefined;
  }

  try {
    return hashArray([ activity.name, toString(activity.date) ]);
  } catch (err) {
    const newErr = err.constructor(`Unable to hash (${ JSON.stringify(activity) }). Inner error:\n${ err.message }`);
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


export function consolidate(activityObj: Activity) {
  if (isNil(activityObj.time)) {
    // assigned with get the empty `TimeOnly`
    activityObj.time = extractDateOnly();
  }
  console.debug(`[ActivityModel.consolidate] .time = ${ activityObj.time }`);
  activityObj.name = activityObj.name.trim();
  activityObj.reporterName = activityObj.reporterName.trim();

  if (!isNil(activityObj.location)) {
    activityObj.location = activityObj.location.trim();
  }
  if (!isNil(activityObj.reportContent)) {
    activityObj.reportContent = activityObj.reportContent.trim();
  }

  return activityObj;
}
