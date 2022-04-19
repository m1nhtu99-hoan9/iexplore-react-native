import { executeSingleSqlCommand } from "./__internal__";
import { SQLError, WebSQLDatabase } from "expo-sqlite";

export async function execInitDbTablesAsync(db: WebSQLDatabase) {
  return await executeSingleSqlCommand(db,
    `CREATE TABLE IF NOT EXISTS "activity"
     (
         "id"            INTEGER,
         "name"          TEXT NOT NULL,
         "location"      TEXT,
         "date"          TEXT NOT NULL,
         "attended_at"   TEXT,
         "reporter_name" TEXT NOT NULL,
         PRIMARY KEY ("id" AUTOINCREMENT)
     );`
  );
}

