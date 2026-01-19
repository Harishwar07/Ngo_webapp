// volunteers.controller.js
import { db } from "../config/db.js";
import { generateId } from "../utils/idGenerator.js";

export const createVolunteer = async (req, res) => {
  console.log("🚀 createVolunteer CALLED");

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const data = { ...req.body };

    /* ---------------- FILE UPLOAD ---------------- */
    if (req.file) {
      data.proof_file_url = `/uploads/${req.file.filename}`;
    }
    delete data.proof_file_upload;

    /* ---------------- FIELD MAPPING ---------------- */
    if (data.volunteer_id) {
      data.volunteer_id_code = data.volunteer_id;
      delete data.volunteer_id;
    }

    /* ---------------- UNIQUE VALIDATION ---------------- */

    // Email
    if (data.email) {
      const [emailExists] = await conn.query(
        `SELECT id FROM volunteers WHERE email = ? LIMIT 1`,
        [data.email]
      );
      if (emailExists.length) {
        await conn.rollback();
        return res.status(409).json({ message: "Volunteer email already exists" });
      }
    }

    // Contact number
    if (data.contact_number) {
      const [mobileExists] = await conn.query(
        `SELECT id FROM volunteers WHERE contact_number = ? LIMIT 1`,
        [data.contact_number]
      );
      if (mobileExists.length) {
        await conn.rollback();
        return res.status(409).json({ message: "Contact number already exists" });
      }
    }

    // Volunteer ID code
    if (data.volunteer_id_code) {
      const [idExists] = await conn.query(
        `SELECT id FROM volunteers WHERE volunteer_id_code = ? LIMIT 1`,
        [data.volunteer_id_code]
      );
      if (idExists.length) {
        await conn.rollback();
        return res.status(409).json({ message: "Volunteer ID already exists" });
      }
    }

    /* ---------------- ATTENDANCE ---------------- */
    let attendance = [];

    if (data.attendance) {
      try {
        attendance = Array.isArray(data.attendance)
          ? data.attendance
          : JSON.parse(data.attendance);
      } catch (err) {
        console.error("Attendance parse failed", err);
        attendance = [];
      }
    }

    delete data.attendance;


    /* ---------------- INSERT ---------------- */
    data.id = await generateId("VOL", "volunteers");

    await conn.query(`INSERT INTO volunteers SET ?`, data);

    for (const row of attendance) {
      await conn.query(
        `INSERT INTO volunteer_attendance
         (volunteer_id, attendance_date, attendance_status, performance, remarks)
         VALUES (?, ?, ?, ?, ?)`,
        [
          data.id,
          row.attendance_date || null,
          row.attendance_status || null,
          row.performance || null,
          row.remarks || null
        ]
      );
    }

    await conn.commit();

    res.status(201).json({
      id: data.id,
      message: "Volunteer created successfully"
    });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};





export const getVolunteerDetail = async (req, res) => {
  try {
    const volunteerId = req.params.id;

    // 1️⃣ Volunteer — format date_of_birth + joining_date
    const [volunteers] = await db.query(
      `
      SELECT 
        id,
        volunteer_frf_name,
        volunteer_frf_owner,
        volunteer_id_code,
        email,
        secondary_email,
        email_opt_out,
        gender,
        DATE_FORMAT(date_of_birth, '%Y-%m-%d') AS date_of_birth,
        father_name,
        mother_name,
        contact_number,
        emergency_contact_number,
        address,
        blood_group,
        company_name,
        experience,
        skill,
        id_proof_type,
        id_number,
        DATE_FORMAT(joining_date, '%Y-%m-%d') AS joining_date,
        proof_file_url,
        created_by,
        created_by_date,
        modified_by,
        modified_date
      FROM volunteers
      WHERE id = ?
      `,
      [volunteerId]
    );

    if (!volunteers.length) return res.sendStatus(404);

    // 2️⃣ Attendance — format attendance_date
    const [attendance] = await db.query(
      `
      SELECT
        id,
        volunteer_id,
        DATE_FORMAT(attendance_date, '%Y-%m-%d') AS attendance_date,
        attendance_status,
        performance,
        remarks
      FROM volunteer_attendance
      WHERE volunteer_id = ?
      ORDER BY attendance_date DESC
      `,
      [volunteerId]
    );

    res.json({
      ...volunteers[0],
      attendance
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const updateVolunteer = async (req, res) => {
  const volunteerId = req.params.id;

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const data = { ...req.body };

    /* ---------------- FILE UPLOAD ---------------- */
    if (req.file) {
      data.proof_file_url = `/uploads/${req.file.filename}`;
    }
    delete data.proof_file_upload;

    /* ---------------- FIELD MAPPING ---------------- */
    if (data.volunteer_id) {
      data.volunteer_id_code = data.volunteer_id;
      delete data.volunteer_id;
    }

    /* ---------------- UNIQUE VALIDATION (EXCLUDE SELF) ---------------- */

    if (data.email) {
      const [emailExists] = await conn.query(
        `SELECT id FROM volunteers WHERE email = ? AND id != ? LIMIT 1`,
        [data.email, volunteerId]
      );
      if (emailExists.length) {
        await conn.rollback();
        return res.status(409).json({ message: "Volunteer email already exists" });
      }
    }

    if (data.contact_number) {
      const [mobileExists] = await conn.query(
        `SELECT id FROM volunteers WHERE contact_number = ? AND id != ? LIMIT 1`,
        [data.contact_number, volunteerId]
      );
      if (mobileExists.length) {
        await conn.rollback();
        return res.status(409).json({ message: "Contact number already exists" });
      }
    }

    if (data.volunteer_id_code) {
      const [idExists] = await conn.query(
        `SELECT id FROM volunteers WHERE volunteer_id_code = ? AND id != ? LIMIT 1`,
        [data.volunteer_id_code, volunteerId]
      );
      if (idExists.length) {
        await conn.rollback();
        return res.status(409).json({ message: "Volunteer ID already exists" });
      }
    }

    /* ---------------- ATTENDANCE ---------------- */
    let attendance = [];
    if (data.attendance) {
      try {
        attendance = Array.isArray(data.attendance)
          ? data.attendance
          : JSON.parse(data.attendance);
      } catch {
        attendance = [];
      }
    }
    delete data.attendance;

    /* ---------------- UPDATE MAIN VOLUNTEER ---------------- */
    await conn.query(
      `UPDATE volunteers SET ? WHERE id = ?`,
      [data, volunteerId]
    );

    /* ---------------- REPLACE ATTENDANCE ---------------- */
    await conn.query(
      `DELETE FROM volunteer_attendance WHERE volunteer_id = ?`,
      [volunteerId]
    );

    for (const row of attendance) {
      await conn.query(
        `
        INSERT INTO volunteer_attendance
        (volunteer_id, attendance_date, attendance_status, performance, remarks)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          volunteerId,
          row.attendance_date || null,
          row.attendance_status || null,
          row.performance || null,
          row.remarks || null
        ]
      );
    }

    await conn.commit();

    res.json({ message: "Volunteer updated successfully" });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};
