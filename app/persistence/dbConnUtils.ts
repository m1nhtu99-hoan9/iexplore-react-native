import * as SQLite from 'expo-sqlite';
import { DB_FILE, APP_NAME } from "../appSettings";

export function openDb(dbName: string = ''): SQLite.WebSQLDatabase {
  if (!dbName || dbName.length === 0) {
    dbName = DB_FILE;
  }
  return SQLite.openDatabase(dbName);
}


