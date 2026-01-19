import { db } from "../config/db.js";
import { generateId } from "../utils/idGenerator.js";

export const createProject = async (req, res) => {
  console.log("🚀 createProject CALLED");

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const data = { ...req.body };

    /* --------------------------------
       1️⃣ MAP FIELDS
    ---------------------------------*/
    if (data.project_id) {
      data.project_id_code = data.project_id;
      delete data.project_id;
    }

    if (data.status) {
      data.project_status = data.status;
      delete data.status;
    }

    if (data.location) {
      data.location_name = data.location;
      delete data.location;
    }

    /* --------------------------------
       2️⃣ UNIQUE PROJECT ID CHECK
    ---------------------------------*/
    if (data.project_id_code) {
      const [existing] = await conn.query(
        `
        SELECT id
        FROM projects
        WHERE project_id_code = ?
        LIMIT 1
        `,
        [data.project_id_code]
      );

      if (existing.length) {
        await conn.rollback();
        return res.status(409).json({
          field: "project_id",
          message: "Project ID already exists"
        });
      }
    }

    /* --------------------------------
       3️⃣ SUBFORM HANDLING
    ---------------------------------*/
    const attendance_logs = data.attendance_logs || [];
    delete data.attendance_logs;

    /* --------------------------------
       4️⃣ AUDIT FIELDS
    ---------------------------------*/
    data.id = await generateId("PRJ", "projects");
    data.created_by = "System";
    data.created_by_date = new Date();
    data.modified_by = "System";
    data.modified_date = new Date();

    delete data.created_date;

    /* --------------------------------
       5️⃣ INSERT PROJECT
    ---------------------------------*/
    await conn.query(`INSERT INTO projects SET ?`, data);

    /* --------------------------------
       6️⃣ INSERT ATTENDANCE LOGS
    ---------------------------------*/
    for (const log of attendance_logs) {
      await conn.query(
        `
        INSERT INTO project_attendance_logs
          (project_id, log_date, attent_list, absent_list, overall_summary, remarks)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          data.id,
          log.log_date || null,
          log.attent_list || null,
          log.absent_list || null,
          log.overall_summary || null,
          log.remarks || null
        ]
      );
    }

    await conn.commit();

    res.status(201).json({
      id: data.id,
      message: "Project created successfully"
    });

  } catch (err) {
    await conn.rollback();

    /* --------------------------------
       7️⃣ DB UNIQUE FALLBACK
    ---------------------------------*/
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        field: "project_id",
        message: "Project ID already exists"
      });
    }

    console.error(err);
    res.status(500).json({ message: "Internal server error" });

  } finally {
    conn.release();
  }
};





export const getProjectDetail = async (req, res) => {
  try {
    const projectId = req.params.id;

    // Format dates + clean currency in SQL
    const [projects] = await db.query(
      `
      SELECT 
        id,
        project_frf_name,
        project_frf_owner,
        email,
        secondary_email,
        email_opt_out,
        project_name,
        project_id_code,
        DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date,
        duration,
        project_status,
        objective,
        budget,
        budget_utilized,
        impact_summary,
        location_name,
        target_group,
        responsible_officer,
        created_by,
        created_by_date,
        modified_date,
        modified_by
      FROM projects
      WHERE id = ?
      `,
      [projectId]
    );

    if (!projects.length) return res.sendStatus(404);

    // Attendance logs — format date
    const [attendance_logs] = await db.query(
      `
      SELECT 
        id,
        project_id,
        DATE_FORMAT(log_date, '%Y-%m-%d') AS log_date,
        attent_list,
        absent_list,
        overall_summary,
        remarks
      FROM project_attendance_logs
      WHERE project_id = ?
      ORDER BY log_date DESC
      `,
      [projectId]
    );

    res.json({
      ...projects[0],
      attendance_logs
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



export const updateProject = async (req, res) => {
  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const projectId = req.params.id;
    const data = { ...req.body };

    /* --------------------------------
       1️⃣ MAP FIELDS (same as create)
    ---------------------------------*/
    if (data.project_id) {
      data.project_id_code = data.project_id;
      delete data.project_id;
    }

    if (data.status) {
      data.project_status = data.status;
      delete data.status;
    }

    if (data.location) {
      data.location_name = data.location;
      delete data.location;
    }

    /* --------------------------------
       2️⃣ SUBFORM EXTRACTION
    ---------------------------------*/
    const attendance_logs = data.attendance_logs || [];
    delete data.attendance_logs;

    /* --------------------------------
       3️⃣ AUDIT FIELDS
    ---------------------------------*/
    data.modified_by = "System";
    data.modified_date = new Date();

    delete data.created_by;
    delete data.created_by_date;

    /* --------------------------------
       4️⃣ UPDATE PROJECT
    ---------------------------------*/
    await conn.query(
      `UPDATE projects SET ? WHERE id = ?`,
      [data, projectId]
    );

    /* --------------------------------
       5️⃣ REPLACE ATTENDANCE LOGS
    ---------------------------------*/
    await conn.query(
      `DELETE FROM project_attendance_logs WHERE project_id = ?`,
      [projectId]
    );

    for (const log of attendance_logs) {
      await conn.query(
        `
        INSERT INTO project_attendance_logs
          (project_id, log_date, attent_list, absent_list, overall_summary, remarks)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          projectId,
          log.log_date || log.date || null,
          log.attent_list || null,
          log.absent_list || null,
          log.overall_summary || null,
          log.remarks || null
        ]
      );
    }

    await conn.commit();

    res.json({
      id: projectId,
      message: "Project updated successfully"
    });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};
