import { WebSQLDatabase, SQLTransaction, ResultSet, ResultSetError } from "expo-sqlite";
import { append, concat, isEmpty, has, length, reduce } from "ramda";
import { DbRow, SqlCommandResult } from "./typings";


export function executeSingleSqlQuery(db: WebSQLDatabase,
                                      rawSql: string,
                                      sqlArgs: ( number | string )[] = []): Promise<DbRow[]> {
  if (!db) {
    throw new TypeError("'db' is expected to be a WebSQLDatabase instance.");
  }

  return new Promise((resolve, reject) => {
    db.exec([ { sql: rawSql, args: sqlArgs } ], true,
      (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        if (results === undefined) {
          resolve([]);
          return;
        }

        const resultCategory = reduce(
          (acc, x) =>
            has('error', x)
            ? ( { ...acc, errors: append(x.error, acc.errors) } )
            : ( { ...acc, resultRows: concat(x.rows, acc.resultRows) } ),
          ( { errors: [] as Error[], resultRows: [] as DbRow[] } ),
          results
        );
        console.debug(`[_.executeSingleSqlQuery] Result analysis: ${ JSON.stringify(resultCategory) }`);

        if (resultCategory.errors.length !== 0) {
          reject(new Error(`SQL error(s): ${ resultCategory.errors.map(_ => _.message).join(', ') }`));
          return;
        }

        resolve(resultCategory.resultRows);
      })
  });
}

export function executeSingleSqlCommand(db: WebSQLDatabase,
                                        rawSql: string,
                                        sqlArgs: ( number | string )[] = []): Promise<SqlCommandResult> {
  if (!db) {
    throw new TypeError("'db' is expected to be a WebSQLDatabase instance.");
  }

  return new Promise((resolve, reject) => {
    db.transaction(tn => tn.executeSql(rawSql, sqlArgs,
      (thisTn, { insertId, rowsAffected }) => {
        console.debug(`[_.executeSingleSqlCommand] Inserted ID = ${ insertId }; No. Affected Rows = ${ rowsAffected }`);
        resolve({ rowsAffected, insertId });
      },
      (thisTn, sqlError) => {
        reject(sqlError);
        return true;
      }));
  });
}
