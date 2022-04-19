import React from "react";
import { DbConnectionContext } from "../../context/dbConnectionContext";
import { openDb } from "../../persistence";
import { DbConnectionProviderProps } from "../typings";

export default function DbConnectionProvider ({ children }: DbConnectionProviderProps) {
  return (
    <DbConnectionContext.Provider value={ openDb() }>
      <>{ children }</>
    </DbConnectionContext.Provider>
  )
}