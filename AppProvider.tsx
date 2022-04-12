import React, { useContext, useEffect, useState } from "react";
import AppLoading from "expo-app-loading";
import { WebSQLDatabase } from "expo-sqlite";

import AppNavigationContainer from "./app/navigation/AppNavigationContainer";
import { execInitDbTables } from "./app/persistence";
import { DbConnectionContext } from "./app/context/DbConnectionContext";

export default function AppProvider() {
  const db = useContext(DbConnectionContext) as WebSQLDatabase;
  const [ ready, setReady ] = useState<boolean>(false);

  useEffect(() => {
    execInitDbTables(db);
    setReady(true);
  }, []);

  if (!ready) {
    return (<AppLoading/>);
  }
  return (
    <AppNavigationContainer/>
  );
}


