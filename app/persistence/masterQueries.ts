import { executeSingleSqlQuery } from "./__internal__";
import { WebSQLDatabase } from "expo-sqlite";
import * as R from "ramda";

export function execDbNamesQuery(db: WebSQLDatabase) {
  let debugMsg = null;
  executeSingleSqlQuery(db, "SELECT name FROM sqlite_master WHERE type='table';",
    {
      handleResult: (names) => {
        debugMsg = R.map(_ => JSON.stringify(_), names)
          .join(', ');
      }
    });
  return debugMsg as string | null;
}