import { WebSQLDatabase } from "expo-sqlite";
import { formatISO } from "date-fns";

import { executeSingleSqlCommand } from "./__internal__";
import { Activity } from "../domain/Activity.d";


export function addNewActivity(db: WebSQLDatabase, entity: Activity): number | null | undefined {
  // assumption: `entity` is already validated
  const { name, location, date, attendedAt, reporterName } = entity;
  const valuesLiteral = [name, location, date, attendedAt, reporterName].map(toSqlText).join(", ");
  const sqlCmd = `INSERT INTO activity (name, location, date, attended_at, reporter_name) VALUES ${valuesLiteral}`;

  let addedActivityId = null;
  executeSingleSqlCommand(db, sqlCmd, {
    handleResult: (_, addedId) => {
      addedActivityId = addedId;
    }
  });
  return addedActivityId;
}

export function deleteActivity(db: WebSQLDatabase, activityId: number) {
  executeSingleSqlCommand(db, `DELETE FROM activity WHERE id = ${activityId}`)
}

function toSqlText(value: string | Date | undefined) {
  if (!value) {
    return "NULL";
  }
  if (value instanceof Date) {
    return formatISO(value as Date);
  }
  return `'${ value.toString() }'`
}