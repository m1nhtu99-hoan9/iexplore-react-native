import { DbConnectionContext } from "./app/context/dbConnectionContext";
import { openDb } from "./app/persistence";
import React from "react";

interface DbConnectionProviderProps {
  children: React.ReactNode
}

export default function DbConnectionProvider ({ children }: DbConnectionProviderProps) {
  return (
    <DbConnectionContext.Provider value={ openDb() }>
      <>{ children }</>
    </DbConnectionContext.Provider>
  )
}