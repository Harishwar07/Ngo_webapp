import { db } from "../config/db.js";
import bcrypt from "bcrypt";

const ALLOWED_ROLES = [
  "Member",
  "Staff",
  "Volunteer",
  "Donor",
  "Finance"
];

export const createUser = async (req, res) => {
  try {
    let { full_name, email, password, role } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // ✅ DEFAULT ROLE
    if (!role) {
      role = "Member";
    }

    // ❌ Block Admin / SuperAdmin from frontend
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(403).json({
        message: "Invalid or unauthorized role assignment"
      });
    }

    // Unique email check
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    await db.query(
      `
      INSERT INTO users
      (full_name, email, password_hash, role, is_active, is_approved)
      VALUES (?, ?, ?, ?, 1, 0)
      `,
      [full_name, email, password_hash, role]
    );

    res.status(201).json({
      message: "User created successfully",
      assigned_role: role,
      approval_required: true
    });

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already exists" });
    }

    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



export const listUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT id, full_name, email, role, is_active, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT id, full_name, email, role, is_active, created_at, updated_at
      FROM users
      WHERE id = ?
    `,
      [req.params.id]
    );

    if (!rows.length) return res.sendStatus(404);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    // ensure user exists
    const [rows] = await db.query(
      "SELECT id, is_approved FROM users WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    if (rows[0].is_approved === 1) {
      return res.status(400).json({ message: "User already approved" });
    }

    await db.query(
      `
      UPDATE users
      SET is_approved = 1,
          approved_by = ?,
          approved_at = NOW()
      WHERE id = ?
      `,
      [req.user.email, id]
    );

    res.json({ message: "User approved successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
