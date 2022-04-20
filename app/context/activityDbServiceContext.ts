import { createContext, useContext } from "react";
import { IActivityDbService } from "../services/typings";

export const ActivityDbServiceContext = createContext<IActivityDbService | undefined>(undefined);

export function useActivityDbServiceContext() {
  return useContext(ActivityDbServiceContext);
}