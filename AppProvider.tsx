import React, { useEffect, useState } from "react";
import AppLoading from "expo-app-loading";

import  { AppNavigationContainer } from "./app/navigation";

export default function AppProvider() {
  const [ ready, setReady ] = useState<boolean>(false);

  useEffect(() => {
    // HACK: synchronously wait for database being initiated for a hard-coded time interval.
    setTimeout(() => {
      setReady(true);
    }, 300);
  }, []);

  if (!ready) {
    return ( <AppLoading/> );
  }
  return (
    <AppNavigationContainer/>
  );
}


