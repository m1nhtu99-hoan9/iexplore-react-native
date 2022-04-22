import { WebSQLDatabase } from "expo-sqlite";
import * as R from "ramda";

import { executeSingleSqlCommand, executeSingleSqlQuery } from "./__internal__";
import { Activity, ActivityDbItem } from "../domain/Activity.d";
import {
  extractDateOnly,
  extractTimeOnly,
  fromISOString,
  fromString,
  mergeDateTime,
  toISOString,
  toString
} from "../helpers/dateTimeUtils";
import { ActivityDbRow } from "./typings";

export async function queryAllActivitiesAsync(db: WebSQLDatabase): Promise<ActivityDbItem[]> {
  const sqlQuery = "SELECT * FROM activity";

  const rows = await executeSingleSqlQuery(db, sqlQuery);

  return R.map(toActivityDbItem, rows as ActivityDbRow[]);
}

export async function addNewActivityAsync(db: WebSQLDatabase, entity: Activity): Promise<number | undefined> {
  // ASSUMPTION: `entity` is already validated and consolidated
  const { name, location, date, time, attendedAt, reporterName } = entity;

  const valuesLiteral = [ name, location, mergeDateTime(date, time), reporterName ]
    .map(toSqlText)
    .join(", ");
  const sqlCmd = `INSERT INTO activity (name, location, date_time, reporter_name)
                  VALUES (${ valuesLiteral })`;
  console.debug(`[addNewActivityAsync] Executing:\n${ sqlCmd }`);

  const { insertId } = await executeSingleSqlCommand(db, sqlCmd);
  return insertId;
}

export async function updateActivityAsync(db: WebSQLDatabase, activityId: number, updatedEntity: Activity): Promise<boolean> {
  // ASSUMPTION: `updatedEntity` is already validated and consolidated
  const { name, location, date, time, reporterName, reportContent } = updatedEntity;
  const valuesLiteral = [
    [ 'name', name ], [ 'location', location ], [ 'date_time', mergeDateTime(date, time) ],
    [ 'reporter_name', reporterName ], [ 'report_content', reportContent ]
  ]
    .map(pair => `${ pair[0] } = ${ toSqlText(pair[1]) }`)
    .join(", ");

  const sqlCmd = `UPDATE activity
                  SET ${ valuesLiteral }
                  WHERE id = ${ activityId }`;
  console.debug(`[updateActivityAsync] Executing:\n${ sqlCmd }`);

  const { rowsAffected } = await executeSingleSqlCommand(db, sqlCmd);
  return rowsAffected > 0;
}

export async function deleteActivityAsync(db: WebSQLDatabase, activityId: number): Promise<boolean> {
  const sqlCmd = `DELETE
                  FROM activity
                  WHERE id = ?`;

  const { rowsAffected } = await executeSingleSqlCommand(db, sqlCmd, [ activityId ]);
  return rowsAffected > 0;
}

export async function deleteAllActivitiesAsync(db: WebSQLDatabase): Promise<number> {
  const { rowsAffected } = await executeSingleSqlCommand(db, "DELETE FROM activity");

  return rowsAffected;
}

function toSqlText(value: string | Date | undefined) {
  if (!value) {
    return "NULL";
  }
  if (value instanceof Date) {
    value = toISOString(value as Date);
  }
  return `'${ value.toString() }'`
}

function toActivityDbItem(activityDbRow: ActivityDbRow): ActivityDbItem {
  const dateTime = fromISOString(activityDbRow.date_time) as Date;

  return {
    activityId: activityDbRow.id,
    name: activityDbRow.name,
    location: R.isNil(activityDbRow.location) ? undefined : activityDbRow.location,
    date: extractDateOnly(dateTime),
    time: extractTimeOnly(dateTime),
    reporterName: activityDbRow.reporter_name as string,
    reportContent: R.isNil(activityDbRow.report_content) ? undefined : activityDbRow.report_content
  } as ActivityDbItem;
}