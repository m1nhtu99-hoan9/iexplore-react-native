import { WebSQLDatabase } from "expo-sqlite";
import * as R from "ramda";

import { executeSingleSqlCommand, executeSingleSqlQuery } from "./__internal__";
import { Activity, ActivityDbItem } from "../domain/Activity.d";
import { fromString, toString } from "../helpers/dateTimeUtils";

export async function queryAllActivitiesAsync(db: WebSQLDatabase): Promise<ActivityDbItem[]> {
  const sqlQuery = "SELECT * FROM activity";

  const rows = await executeSingleSqlQuery(db, sqlQuery);
  console.debug(`[queryAllActivitiesAsync] Raw result(s): ${ JSON.stringify(rows) }`)
  // @ts-ignore
  return R.map<any, ActivityDbItem>((x) => ( {
    activityId: x.id as number,
    name: x.name as string,
    location: x.location as string | undefined,
    date: fromString(x.date),
    attendedAt: R.isNil(x.attended_at) ? undefined : fromString(x.attended_at),
    reporterName: x.reporter_name as string
  } ), rows);
}


export async function addNewActivityAsync(db: WebSQLDatabase, entity: Activity): Promise<number | undefined> {
  // assumption: `entity` is already validated
  const { name, location, date, attendedAt, reporterName } = entity;
  const valuesLiteral = [ name, location, date, attendedAt, reporterName ].map(toSqlText).join(", ");
  const sqlCmd = `INSERT INTO activity (name, location, date, attended_at, reporter_name)
                  VALUES (${ valuesLiteral })`;
  console.debug(`[addNewActivityAsync] Executing: ${ sqlCmd }`);

  const { insertId } = await executeSingleSqlCommand(db, sqlCmd);
  return insertId;
}

export async function updateActivityAsync(db: WebSQLDatabase, activityId: number, updatedEntity: Activity): Promise<boolean> {
  // assumption: `updatedEntity` is already validated
  const { name, location, date, attendedAt, reporterName } = updatedEntity;
  const valuesLiteral = [
    [ 'name', name ], [ 'location', location ], [ 'date', date ],
    [ 'attended_at', attendedAt ], [ 'reporter_name', reporterName ]
  ].map(pair => `${ pair[0] } = ${ toSqlText(pair[1]) }`).join(", ");

  const sqlCmd = `UPDATE activity
                  SET ${ valuesLiteral }
                  WHERE id = ${ activityId }`;
  console.debug(`[updateActivityAsync] Executing: ${ sqlCmd }`);

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
    value = toString(value as Date);
  }
  return `'${ value.toString() }'`
}