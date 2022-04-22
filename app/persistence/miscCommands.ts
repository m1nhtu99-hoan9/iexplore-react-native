import { executeSingleSqlCommand } from "./__internal__";
import { SQLError, WebSQLDatabase } from "expo-sqlite";

export async function execInitDbTablesAsync(db: WebSQLDatabase) {
  return await executeSingleSqlCommand(db,
    `CREATE TABLE IF NOT EXISTS "activity"
     (
         "id"             INTEGER,
         "name"           TEXT NOT NULL,
         "location"       TEXT,
         "date_time"      TEXT NOT NULL,
         "reporter_name"  TEXT NOT NULL,
         "report_content" TEXT,
         PRIMARY KEY ("id" AUTOINCREMENT)
     );`
  );
}


export async function execDropTablesAsync(db: WebSQLDatabase) {
  return await executeSingleSqlCommand(db, `DROP TABLE IF EXISTS "activity";`);
}
