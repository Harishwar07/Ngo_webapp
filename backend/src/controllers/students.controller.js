import { db } from "../config/db.js";
import { generateId } from "../utils/idGenerator.js";

export const createStudent = async (req, res) => {
  console.log("🚀 createStudent CALLED");
  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const data = { ...req.body };

    const { parents_contact_number, email } = data;

    /* ============================
       🔒 UNIQUE VALIDATION
    ============================ */

    if (parents_contact_number) {
      const [mobileExists] = await conn.query(
        `SELECT id FROM students WHERE parents_contact_number = ?`,
        [parents_contact_number]
      );

      if (mobileExists.length) {
        await conn.rollback();
        return res.status(409).json({
          message: "Parent mobile number already exists"
        });
      }
    }

    if (email) {
      const [emailExists] = await conn.query(
        `SELECT id FROM students WHERE email = ?`,
        [email]
      );

      if (emailExists.length) {
        await conn.rollback();
        return res.status(409).json({
          message: "Student email already exists"
        });
      }
    }

    /* ============================
       SESSION LOGS
    ============================ */

    const session_logs =
      data.session_logs || data.student_session_logs || [];

    delete data.session_logs;
    delete data.student_session_logs;

    data.created_by = req.user?.name || "System";
    data.created_by_date = new Date();

    data.id = await generateId("STU", "students");

    await conn.query(`INSERT INTO students SET ?`, data);

    for (const log of session_logs) {
      await conn.query(
        `INSERT INTO student_session_logs 
         (student_id, session_date, course, topic_covered, interest_level,
          challenges_faced, understanding_level, overall_score, remarks, feedback, home_work)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.id,
          log.session_date || log.date || null,
          log.course || null,
          log.topic_covered || null,
          log.interest_level || null,
          log.challenges_faced || null,
          log.understanding_level || null,
          log.overall_score || null,
          log.remarks || null,
          log.feedback || null,
          log.home_work || null
        ]
      );
    }

    await conn.commit();

    res.status(201).json({
      id: data.id,
      message: "Student created successfully"
    });

  } catch (err) {
    await conn.rollback();

    // DB-level safety net
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Duplicate student data detected"
      });
    }

    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};






export const getStudentDetail = async (req, res) => {
  try {
    const studentId = req.params.id;

    // 1️⃣ Get student — format date_of_birth
    const [students] = await db.query(
      `
      SELECT 
        id,
        student_frf_name,
        student_frf_owner,
        email,
        secondary_email,
        email_opt_out,
        DATE_FORMAT(date_of_birth, '%Y-%m-%d') AS date_of_birth,
        father_name,
        mother_name,
        blood_group,
        parents_contact_number,
        monthly_income,
        address,
        permanent_address,
        class_name,
        section,
        medium,
        school,
        created_by,
        created_by_date,
        modified_by,
        modified_date
      FROM students 
      WHERE id = ?
      `,
      [studentId]
    );

    if (!students.length) return res.sendStatus(404);

    // 2️⃣ Get session logs — format session_date
    const [logs] = await db.query(
      `
      SELECT
        id,
        student_id,
        DATE_FORMAT(session_date, '%Y-%m-%d') AS session_date,
        course,
        topic_covered,
        interest_level,
        challenges_faced,
        understanding_level,
        overall_score,
        remarks,
        feedback,
        home_work
      FROM student_session_logs
      WHERE student_id = ?
      ORDER BY session_date DESC
      `,
      [studentId]
    );

    // 3️⃣ Merge response
    res.json({
      ...students[0],
      session_logs: logs
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



export const updateStudent = async (req, res) => {
  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const studentId = req.params.id;
    const data = { ...req.body };

    // 🔥 EXTRACT sub-form
    const session_logs = data.session_logs || [];
    delete data.session_logs;

    // 🔹 UPDATE students table ONLY
    await conn.query(
      `UPDATE students SET ? WHERE id = ?`,
      [data, studentId]
    );

    // 🔹 REMOVE old logs (or use diff logic later)
    await conn.query(
      `DELETE FROM student_session_logs WHERE student_id = ?`,
      [studentId]
    );

    // 🔹 INSERT new logs
    for (const log of session_logs) {
      await conn.query(
        `INSERT INTO student_session_logs
        (student_id, session_date, course, topic_covered,
         interest_level, challenges_faced, understanding_level,
         overall_score, remarks, feedback, home_work)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          studentId,
          log.session_date || null,
          log.course || null,
          log.topic_covered || null,
          log.interest_level || null,
          log.challenges_faced || null,
          log.understanding_level || null,
          log.overall_score || null,
          log.remarks || null,
          log.feedback || null,
          log.home_work || null
        ]
      );
    }

    await conn.commit();
    res.json({ message: "Student updated successfully" });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};
