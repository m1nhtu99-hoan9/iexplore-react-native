import { format, formatISO, parse } from "date-fns";
import { enGB } from "date-fns/locale";

export function toString(date: Date) {
  try {
    return format(date, 'Pp', { locale: enGB });
  } catch (err) {
    err.message = `[dateTimeUtils.toString] ${err.message}`
    if (err instanceof RangeError || err instanceof TypeError) {
      err.message += ` (${JSON.stringify(date)})`
    }
    throw err;
  }
}

export function toISOString(date: Date) {
  try {
    return formatISO(date);
  } catch (err) {
    err.message = `[dateTimeUtils.toISOString] ${err.message}`;
    throw err;
  }
}

export function fromString(string: string) {
  try {
    return parse(string, 'Pp', new Date(), { locale: enGB });
  } catch (err) {
    err.message = `[dateTimeUtils.fromString] ${err.message}`;
    throw err;
  }
}