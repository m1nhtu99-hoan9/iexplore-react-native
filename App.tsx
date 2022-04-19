import React from 'react';
import AppProvider from "./AppProvider";
import { ActivityDbServiceProvider, DbConnectionProvider } from "./app/components/providers";

export default function App() {
  return (
    <DbConnectionProvider>
      <ActivityDbServiceProvider>
        <AppProvider/>
      </ActivityDbServiceProvider>
    </DbConnectionProvider>
  )
};
