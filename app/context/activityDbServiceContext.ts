import { createContext, useContext } from "react";
import { ActivityDbService } from "../services";

export const ActivityDbServiceContext = createContext<ActivityDbService | undefined>(undefined);

export function useActivityDbServiceContext() {
  return useContext(ActivityDbServiceContext);
}