import React from 'react';
import AppProvider from "./AppProvider";
import DbConnectionProvider from "./DbConnectionProvider";

export default function App() {
  return (
    <DbConnectionProvider>
      <AppProvider/>
    </DbConnectionProvider>
  )
};
