import React, { createContext, useContext } from "react";
import { WebSQLDatabase } from "expo-sqlite";

export const DbConnectionContext = createContext<WebSQLDatabase | undefined>(undefined);

export function useDbConnectionContext(): WebSQLDatabase | undefined {
  return useContext(DbConnectionContext);
}
