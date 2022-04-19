export type DbEntity = {
  [columnName: string]: any
};

export type SqlCommandResult = {
  rowsAffected: number,
  insertId?: number
}