export type DbRow = {
  [columnName: string]: any
};

export type SqlCommandResult = {
  rowsAffected: number,
  insertId?: number
}

export type ActivityDbRow = DbRow & {
  id: number,
  name: string,
  location?: string | null,
  date_time: string,
  reporter_name: string,
  report_content?: string | null
}