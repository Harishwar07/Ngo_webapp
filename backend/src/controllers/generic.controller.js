import { db } from '../config/db.js';
import { ENTITY_TABLE_MAP } from '../config/entityMap.js';

const getTable = (entity) => {
  const table = ENTITY_TABLE_MAP[entity];
  if (!table) {
    throw new Error('Invalid entity');
  }
  return table;
};

// GET LIST
export const getList = async (req, res) => {
  try {
    const table = getTable(req.params.entity);
    const [rows] = await db.query(`SELECT * FROM ${table}`);
    res.json(rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET DETAIL
export const getDetail = async (req, res) => {
  try {
    const table = getTable(req.params.entity);
    const [rows] = await db.query(
      `SELECT * FROM ${table} WHERE id = ?`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.sendStatus(404);
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// CREATE
export const createRecord = async (req, res) => {
  try {
    const table = getTable(req.params.entity);
    const data = req.body;

    await db.query(`INSERT INTO ${table} SET ?`, data);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const create = (table) => async (req, res) => {
  try {
    const [result] = await db.query(
      `INSERT INTO ${table} SET ?`,
      req.body
    );

    res.status(201).json({
      id: result.insertId,
      ...req.body
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

