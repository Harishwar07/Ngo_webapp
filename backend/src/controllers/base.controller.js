import { db } from '../config/db.js';
import sanitizeHtml from "sanitize-html";
import { getSafeTable } from "../utils/safeTables.js";

/**
 * LIST
 */
export const list = (table) => async (req, res) => {
  try {
    const safeTable = getSafeTable(table);

    if (!safeTable) {
      return res.status(400).json({ message: "Invalid table" });
    }

    const [rows] = await db.query(`SELECT * FROM ${safeTable} ORDER BY id DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * DETAIL
 */
export const detail = (table) => async (req, res) => {
  try {
    const id = req.params.id;
    const safeTable = getSafeTable(table);

    if (!safeTable) {
      return res.status(400).json({ message: "Invalid table" });
    }
    const [rows] = await db.query(
      `SELECT * FROM ${safeTable} WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!rows.length) return res.sendStatus(404);

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * CREATE
 */
export const create = (table) => async (req, res) => {
  console.log(`CREATE -> ${table}`);
  console.log("BODY:", req.body);

  try {
    const data = req.body;
    Object.keys(data).forEach(key => {
      if (typeof data[key] === "string") {
        data[key] = sanitizeHtml(data[key], {
          allowedTags: [],
          allowedAttributes: {}
        });
      }
    });
    delete data.id;
    const safeTable = getSafeTable(table);

    if (!safeTable) {
      return res.status(400).json({ message: "Invalid table" });
    }
    const [result] = await db.query(
      `INSERT INTO ${safeTable} SET ?`,
      data
    );

    res.status(201).json({
      id: result.insertId,
      ...data
    });

  } catch (err) {
    console.error("SQL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



/**
 * UPDATE
 */
export const update = (table) => async (req, res) => {
  console.log("REQ BODY =>", req.body);
  try {
    const id = req.params.id;
    const data = req.body;
    Object.keys(data).forEach(key => {
    if (typeof data[key] === "string") {
        data[key] = sanitizeHtml(data[key], {
        allowedTags: [],
        allowedAttributes: {}
        });
    }
    });
    delete data.id;

    data.modified_by = req.user?.name || "System";
    data.modified_date = new Date();

    const safeTable = getSafeTable(table);

    if (!safeTable) {
      return res.status(400).json({ message: "Invalid table" });
    }
    await db.query(
      `UPDATE ${safeTable} SET ? WHERE id = ?`,
      [data, id]
    );

    res.json({ message: 'Updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * DELETE
 */
export const remove = (table) => async (req, res) => {
  try {
    const id = req.params.id;
    const safeTable = getSafeTable(table);

    if (!safeTable) {
      return res.status(400).json({ message: "Invalid table" });
    }
    await db.query(
      `DELETE FROM ${safeTable} WHERE id = ?`,
      [id]
    );

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
