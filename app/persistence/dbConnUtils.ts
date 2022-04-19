import * as SQLite from 'expo-sqlite';
import { has } from "ramda";
import { DB_FILE, APP_NAME } from "../appSettings";
import { execInitDbTablesAsync } from "./miscCommands";
import { SQLError } from "expo-sqlite";


export function openDb(): SQLite.WebSQLDatabase {
  return SQLite.openDatabase(DB_FILE, undefined, undefined, undefined,
    db => {
      console.info("[openDb] Initiating database tables...");

      execInitDbTablesAsync(db)
        .catch((e: Error | SQLError) => {
          const msg = "[openDb] Failed to initiate database tables";

          if (has('code', e)) {
            console.warn(`${ msg }. SQL error code: [${ e.code }], message:\n${ e.message }`);
            return;
          }

          console.warn(`${ msg }.\n${ e.message }`);
        });
    });
}


