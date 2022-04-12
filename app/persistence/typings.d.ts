import { SQLError, SQLTransaction } from "expo-sqlite";

export interface ExecuteSqlQueryBasicOptions extends ExecuteSqlBasicOptions {
  handleResult?: SqlQueryResultCallback,
}

export interface ExecuteSqlQueryOptions extends ExecuteSqlOptions {
  handleResult?: SqlQueryResultExtendedCallback,
}

export interface ExecuteSqlCommandBasicOptions extends ExecuteSqlBasicOptions {
  handleResult?: SqlCommandResultCallback,
}

export interface ExecuteSqlCommandOptions extends ExecuteSqlOptions {
  handleResult?: SqlCommandResultExtendedCallback,
}

export type SqlErrorExtendedCallback = (transaction: SQLTransaction) => SqlErrorCallback;
export type SqlErrorCallback = (sqlError: SQLError) => boolean;

export type SqlQueryResultExtendedCallback = (transaction: SQLTransaction) => SqlQueryResultCallback;
export type SqlQueryResultCallback = (resultRows: any[]) => void;

export type SqlCommandResultExtendedCallback = (transaction: SQLTransaction) => SqlCommandResultCallbacks;
export type SqlCommandResultCallback = (rowsAffected: number, insertId?: number) => void;

interface ExecuteSqlBasicOptions {
  sqlArgs?: (number | string)[],
  handleError?: SqlErrorCallback
}

interface ExecuteSqlOptions {
  sqlArgs?: (number | string)[],
  handleError?: SqlErrorExtendedCallback
}

export interface ApartmentDbProps {
  id?: number,
  property_type?: string,
  monthly_rent_price: number,
  num_bedrooms?: number,
  furniture_type?: string,
  added_at: string,
  reporter_name?: string,
  notes?: string
}