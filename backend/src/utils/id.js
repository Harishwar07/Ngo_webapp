import { db } from "../config/db.js";

export const generateId = async (prefix, table) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS count FROM ${table}`
  );

  const num = rows[0].count + 1;
  return `${prefix}_${num.toString().padStart(4, "0")}`;
};