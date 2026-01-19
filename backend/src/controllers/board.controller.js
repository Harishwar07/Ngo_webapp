import { db } from "../config/db.js";
import { generateId } from "../utils/idGenerator.js";

export const createBoardMember = async (req, res) => {
  console.log("🚀 createBoardMember CALLED");

  const conn = await db.getConnection();

  try {
    const data = { ...req.body };

    /* --------------------------------
       1️⃣ DUPLICATE EMAIL CHECK
    ---------------------------------*/
    const [existing] = await conn.query(
      `
      SELECT id 
      FROM board_members 
      WHERE email = ?
      LIMIT 1
      `,
      [data.email]
    );

    if (existing.length) {
      return res.status(409).json({
        field: "email",
        message: "Email already exists"
      });
    }

    /* --------------------------------
       2️⃣ FIELD MAPPING
    ---------------------------------*/
    if (data.board_id) {
      data.board_id_code = data.board_id;
      delete data.board_id;
    }

    if (data.proof_file_upload) {
      data.proof_file_url = data.proof_file_upload;
      delete data.proof_file_upload;
    }

    if (req.file) {
      data.proof_file_url = `/uploads/${req.file.filename}`;
    }

    data.created_by = "System";
    data.created_by_date = new Date();
    data.modified_by = "System";
    data.modified_date = new Date();

    data.id = await generateId("BRD", "board_members");

    /* --------------------------------
       3️⃣ INSERT
    ---------------------------------*/
    await conn.query(`INSERT INTO board_members SET ?`, data);

    res.status(201).json({
      id: data.id,
      message: "Board member created successfully"
    });

  } catch (err) {

    /* --------------------------------
       4️⃣ DB UNIQUE FALLBACK
    ---------------------------------*/
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        field: "email",
        message: "Email already exists"
      });
    }

    console.error(err);
    res.status(500).json({ message: "Internal server error" });

  } finally {
    conn.release();
  }
};






export const getBoardMemberDetail = async (req, res) => {
  try {
    const boardId = req.params.id;

    const [members] = await db.query(
      `
      SELECT 
        id,
        board_frf_name,
        board_frf_owner,
        email,
        secondary_email,
        email_opt_out,
        gender,
        DATE_FORMAT(date_of_birth, '%Y-%m-%d') AS date_of_birth,
        contact_number,
        emergency_contact_number,
        blood_group,
        father_name,
        mother_name,
        address,
        id_proof_type,
        id_number,
        DATE_FORMAT(joining_date, '%Y-%m-%d') AS joining_date,
        designation,
        role_description,
        proof_file_url, 
        created_by_date,
        modified_date,
        created_by,
        modified_by
      FROM board_members
      WHERE id = ?
      `,
      [boardId]
    );

    if (!members.length) return res.sendStatus(404);

    res.json(members[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const updateBoardMember = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const boardId = req.params.id;
    const data = { ...req.body };

    /* --------------------------------
       1️⃣ DUPLICATE EMAIL CHECK (EXCLUDE SELF)
    ---------------------------------*/
    if (data.email) {
      const [existing] = await conn.query(
        `
        SELECT id 
        FROM board_members 
        WHERE email = ? AND id <> ?
        LIMIT 1
        `,
        [data.email, boardId]
      );

      if (existing.length) {
        return res.status(409).json({
          field: "email",
          message: "Email already exists"
        });
      }
    }

    /* --------------------------------
       2️⃣ FIELD MAPPING
    ---------------------------------*/
    if (data.board_id) {
      data.board_id_code = data.board_id;
      delete data.board_id;
    }

    if (data.proof_file_upload) {
      data.proof_file_url = data.proof_file_upload;
      delete data.proof_file_upload;
    }

    if (req.file) {
      data.proof_file_url = `/uploads/${req.file.filename}`;
    }

    /* --------------------------------
       3️⃣ AUDIT FIELDS
    ---------------------------------*/
    data.modified_by = "System";
    data.modified_date = new Date();

    delete data.created_by;
    delete data.created_by_date;
    delete data.id;

    /* --------------------------------
       4️⃣ UPDATE
    ---------------------------------*/
    const [result] = await conn.query(
      `UPDATE board_members SET ? WHERE id = ?`,
      [data, boardId]
    );

    if (result.affectedRows === 0) {
      return res.sendStatus(404);
    }

    res.json({
      id: boardId,
      message: "Board member updated successfully"
    });

  } catch (err) {

    /* --------------------------------
       5️⃣ DB UNIQUE FALLBACK
    ---------------------------------*/
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        field: "email",
        message: "Email already exists"
      });
    }

    console.error(err);
    res.status(500).json({ message: "Internal server error" });

  } finally {
    conn.release();
  }
};

