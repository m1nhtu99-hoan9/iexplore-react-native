import { executeSingleSqlQuery } from "./__internal__";
import { SQLError, WebSQLDatabase } from "expo-sqlite";
import * as R from "ramda";

export async function queryDbTableNamesAsync(db: WebSQLDatabase): Promise<string> {
  const nameObjs = await executeSingleSqlQuery(db, "SELECT name FROM sqlite_master WHERE type='table'");
  return R.map(_ => JSON.stringify(_), nameObjs).join(', ');
}