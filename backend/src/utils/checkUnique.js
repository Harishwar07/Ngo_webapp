import { db } from "../config/db.js";

export async function checkUnique(table, field, value, excludeId = null) {
  let sql = `SELECT id FROM ${table} WHERE ${field} = ?`;
  const params = [value];

  if (excludeId) {
    sql += " AND id != ?";
    params.push(excludeId);
  }

  const [rows] = await db.query(sql, params);
  return rows.length > 0;
}
