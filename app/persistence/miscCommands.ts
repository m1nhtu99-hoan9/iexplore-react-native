import { executeSingleSqlCommand } from "./__internal__";
import { SQLError, WebSQLDatabase } from "expo-sqlite";

export function execInitDbTables(db: WebSQLDatabase) {
  let isOk = false;

  function handleError(_: SQLError) {
    isOk = false;
    return true;
  }

  function handleResult(_0: number, _1?: number) {
    isOk = true;
  }

  executeSingleSqlCommand(db, `CREATE TABLE IF N0T EXISTS "activity"
                               (
                                   "id"            INTEGER NOT NULL UNIQUE,
                                   "name"          TEXT    NOT NULL,
                                   "location"      TEXT,
                                   "date"          TEXT    NOT NULL,
                                   "attended_at"   TEXT,
                                   "reporter_name" TEXT    NOT NULL,
                                   PRIMARY KEY ("id")
                               )`,
  { handleError, handleResult },
  );

  return isOk;
}

