import React from "react";

import { ActivityDbServiceContext } from "../../context/activityDbServiceContext";
import { ActivityDbServiceProviderProps } from "../typings";
import { ActivityDbService } from "../../services";
import { openDb } from "../../persistence";

export default function ActivityDbServiceProvider({ children }: ActivityDbServiceProviderProps) {
  const db = openDb();

  return (
    <ActivityDbServiceContext.Provider value={ new ActivityDbService(db) }>
      <>{ children }</>
    </ActivityDbServiceContext.Provider>
  )
}