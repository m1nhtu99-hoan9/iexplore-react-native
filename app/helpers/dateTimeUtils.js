import {
  set,
  format,
  formatISO,
  parse,
  parseISO,
  getDate,
  getMonth,
  getYear,
  getHours,
  getMinutes,
  getSeconds,
  getMilliseconds,
  startOfDay
} from "date-fns";
import {enGB} from "date-fns/locale";

import {isNil, isEmpty} from "ramda";

export function toString(date) {
  try {
    return format(date, 'Pp', {locale: enGB});
  } catch (err) {
    err.message = `[dateTimeUtils.toString] ${err.message}`
    if (err instanceof RangeError || err instanceof TypeError) {
      err.message += ` (${JSON.stringify(date)})`
    }
    throw err;
  }
}

export function toISOString(date) {
  try {
    return formatISO(date);
  } catch (err) {
    err.message = `[dateTimeUtils.toISOString] ${err.message}`;
    throw err;
  }
}

export function fromString(string) {
  try {
    return parse(string, 'Pp', new Date(), {locale: enGB});
  } catch (err) {
    err.message = `[dateTimeUtils.fromString] ${err.message}`;
    throw err;
  }
}

export function fromISOString(string) {
  if (isNil(string) || isEmpty(string)) {
    return null;
  }

  try {
    return parseISO(string);
  } catch (err) {
    err.message = `[dateTimeUtils.fromISOString] ${err.message}`;
    throw err;
  }
}

export function extractDateOnly(date = undefined) {
  return startOfDay(date || new Date());
}

export function extractTimeOnly(date = undefined) {
  const d = !isNil(date) ? new Date(date) : new Date();

  return set(d, {
    hours: getHours(d), minutes: getMinutes(d),
    seconds: getSeconds(d), milliseconds: getMilliseconds(d)
  });
}

export function mergeDateTime(dateOnly = undefined, timeOnly = undefined) {
  const d = dateOnly || new Date();
  const t = timeOnly || new Date();

  return set(new Date(), {
    date: getDate(d), month: getMonth(d), year: getYear(d),
    hours: getHours(t), minutes: getMinutes(t),
    seconds: getSeconds(t), milliseconds: getMilliseconds(t)
  });
}

export function splitDateTime(date = undefined) {
  const dt = date || new Date();
  return [extractDateOnly(dt), extractTimeOnly(dt)];
}