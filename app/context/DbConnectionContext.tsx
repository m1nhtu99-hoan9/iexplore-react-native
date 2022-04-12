import React, { createContext } from "react";
import { WebSQLDatabase } from "expo-sqlite";

export const DbConnectionContext = createContext<WebSQLDatabase | undefined>(undefined);
