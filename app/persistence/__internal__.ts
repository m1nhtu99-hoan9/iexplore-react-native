import { WebSQLDatabase, SQLTransaction } from "expo-sqlite";
import {
  ExecuteSqlQueryBasicOptions, ExecuteSqlQueryOptions,
  ExecuteSqlCommandBasicOptions, ExecuteSqlCommandOptions
} from "./typings";


export function executeSingleSqlQuery(db: WebSQLDatabase,
                                      rawSql: string,
                                      opts?: ExecuteSqlQueryBasicOptions) {
  if (!db) {
    throw new TypeError("'db' is expected to be a WebSQLDatabase instance.");
  }

  db.transaction(tn => {
    executeSqlQuery(tn, rawSql, fromQueryBasicOptions(opts));
  });
}

export function executeSingleSqlCommand(db: WebSQLDatabase,
                                        rawSql: string,
                                        opts?: ExecuteSqlCommandBasicOptions) {
  if (!db) {
    throw new TypeError("'db' is expected to be a WebSQLDatabase instance.");
  }

  db.transaction(tn => {
    executeSqlQuery(tn, rawSql, fromCommandBasicOptions(opts));
  });
}

export function executeSqlQuery(transaction: SQLTransaction,
                                rawSql: string,
                                opts?: ExecuteSqlQueryOptions) {
  if (!transaction) {
    throw new TypeError("'transaction' is expected to be a SQLTransaction instance.");
  }

  if (!opts) {
    transaction.executeSql(rawSql);
    return;
  }

  const { sqlArgs, handleResult, handleError } = opts;
  transaction.executeSql(rawSql, sqlArgs ?? [],
    (thisTn, { rows: { _array } }) => {
      handleResult?.(thisTn)(_array);
    },
    (thisTn, sqlError) => {
      return handleError?.(thisTn)(sqlError) ?? false;
    });
}

export function executeSqlCommand(transaction: SQLTransaction,
                                  rawSql: string,
                                  opts?: ExecuteSqlCommandOptions) {

  if (!transaction) {
    throw new TypeError("'transaction' is expected to be a SQLTransaction instance.");
  }

  if (!opts) {
    transaction.executeSql(rawSql);
    return;
  }

  const { sqlArgs, handleResult, handleError } = opts;
  transaction.executeSql(rawSql, sqlArgs ?? [],
    (thisTn, { insertId, rowsAffected }) => {
      handleResult?.(thisTn)(rowsAffected, insertId);
    },
    (thisTn, sqlError) => {
      return handleError?.(thisTn)(sqlError) ?? false;
    });
}

function fromQueryBasicOptions(opts?: ExecuteSqlQueryBasicOptions) : ExecuteSqlQueryOptions | undefined {
  if (!opts) {
    return undefined;
  }

  const { sqlArgs, handleResult, handleError } = opts;

  return {
    sqlArgs,
    handleResult: handleResult && (_ => handleResult),
    handleError: handleError && (_ => handleError)
  }
}

function fromCommandBasicOptions(opts?: ExecuteSqlCommandBasicOptions) : ExecuteSqlCommandOptions | undefined {
  if (!opts) {
    return undefined;
  }

  const { sqlArgs, handleResult, handleError } = opts;

  return {
    sqlArgs,
    handleResult: handleResult && (_ => handleResult),
    handleError: handleError && (_ => handleError)
  }
}
