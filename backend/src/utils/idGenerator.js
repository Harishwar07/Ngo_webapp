import { db } from "../config/db.js";

export async function generateId(prefix, table) {

  const [rows] = await db.query(
    `
    SELECT 
      LPAD(
        IFNULL(
          MAX(CAST(SUBSTRING(id, LENGTH(?) + 2) AS UNSIGNED)),
          0
        ) + 1,
        4,
        '0'
      ) AS next_id
    FROM ${table}
    `,
    [prefix]
  );

  return `${prefix}_${rows[0].next_id}`;
}

