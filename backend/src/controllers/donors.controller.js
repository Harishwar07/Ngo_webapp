import { db } from "../config/db.js";
import { generateId } from "../utils/idGenerator.js";

export const createDonor = async (req, res) => {
  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const data = { ...req.body };

    /* -------------------------------
       1️⃣ DUPLICATE CHECK
    --------------------------------*/
    const [existing] = await conn.query(
      `
      SELECT email, contact_number
      FROM donors
      WHERE email = ? OR contact_number = ?
      LIMIT 1
      `,
      [data.email, data.contact_number]
    );

    if (existing.length) {
      const duplicate = existing[0];

      if (duplicate.email === data.email) {
        return res.status(409).json({
          field: "email",
          message: "Email already exists"
        });
      }

      if (duplicate.contact_number === data.contact_number) {
        return res.status(409).json({
          field: "contact_number",
          message: "Contact number already exists"
        });
      }
    }

    /* -------------------------------
       2️⃣ NORMAL FLOW
    --------------------------------*/
    const donations = data.donations || [];
    delete data.donations;

    if (data.donor_id) {
      data.donor_id_code = data.donor_id;
      delete data.donor_id;
    }

    if (data.type) {
      data.donor_type = data.type;
      delete data.type;
    }

    data.id = await generateId("DON", "donors");

    await conn.query(`INSERT INTO donors SET ?`, data);

    for (const don of donations) {
      await conn.query(
        `INSERT INTO donations 
         (donor_id, donation_date, transaction_id, purpose, receipt_number,
          receipt_80g_issued, acknowledgment_sent, donor_feedback, remarks, amount)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.id,
          don.donation_date || null,
          don.transaction_id || null,
          don.purpose || null,
          don.receipt_number || null,
          don["receipt_80g_issued"] || null,
          don.acknowledgment_sent || null,
          don.donor_feedback || null,
          don.remarks || null,
          don.amount || 0
        ]
      );
    }

    await conn.commit();

    res.status(201).json({
      id: data.id,
      message: "Donor created successfully"
    });

  } catch (err) {
    await conn.rollback();

    /* -------------------------------
       3️⃣ DB UNIQUE FALLBACK
    --------------------------------*/
    if (err.code === "ER_DUP_ENTRY") {
      if (err.message.includes("uq_donors_email")) {
        return res.status(409).json({
          field: "email",
          message: "Email already exists"
        });
      }
      if (err.message.includes("uq_donors_contact")) {
        return res.status(409).json({
          field: "contact_number",
          message: "Contact number already exists"
        });
      }
    }

    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    conn.release();
  }
};




export const getDonorDetail = async (req, res) => {
  try {
    const donorId = req.params.id;

    // 1️⃣ Donor (safe — keep all fields, but format date fields if present)
    const [donors] = await db.query(
      `
      SELECT 
        id,
        donor_frf_name,
        donor_frf_owner,
        email,
        secondary_email,
        email_opt_out,
        donor_id_code,
        donor_type,
        contact_person,
        contact_number,
        address,
        created_by,
        DATE_FORMAT(created_by_date, '%Y-%m-%d') AS created_by_date,
        modified_by,
        DATE_FORMAT(modified_date, '%Y-%m-%d') AS modified_date
      FROM donors
      WHERE id = ?
      `,
      [donorId]
    );

    if (!donors.length) return res.sendStatus(404);

    // 2️⃣ Donations — format donation_date
    const [donations] = await db.query(
      `
      SELECT 
        id,
        donor_id,
        DATE_FORMAT(donation_date, '%Y-%m-%d') AS donation_date,
        transaction_id,
        purpose,
        receipt_number,
        receipt_80g_issued,
        acknowledgment_sent,
        donor_feedback,
        remarks,
        amount
      FROM donations
      WHERE donor_id = ?
      ORDER BY donation_date DESC
      `,
      [donorId]
    );

    res.json({
      ...donors[0],
      donations
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



export const updateDonor = async (req, res) => {
  const donorId = req.params.id;

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const data = { ...req.body };

    /* -------------------------------
       1️⃣ DUPLICATE CHECK (EXCLUDE SELF)
    --------------------------------*/
    if (data.email || data.contact_number) {
      const [existing] = await conn.query(
        `
        SELECT email, contact_number
        FROM donors
        WHERE (email = ? OR contact_number = ?)
          AND id != ?
        LIMIT 1
        `,
        [data.email, data.contact_number, donorId]
      );

      if (existing.length) {
        const duplicate = existing[0];

        if (duplicate.email === data.email) {
          await conn.rollback();
          return res.status(409).json({
            field: "email",
            message: "Email already exists"
          });
        }

        if (duplicate.contact_number === data.contact_number) {
          await conn.rollback();
          return res.status(409).json({
            field: "contact_number",
            message: "Contact number already exists"
          });
        }
      }
    }

    /* -------------------------------
       2️⃣ SUBFORM: DONATIONS
    --------------------------------*/
    let donations = [];
    if (data.donations) {
      try {
        donations = Array.isArray(data.donations)
          ? data.donations
          : JSON.parse(data.donations);
      } catch {
        donations = [];
      }
    }
    delete data.donations;

    /* -------------------------------
       3️⃣ FIELD MAPPING
    --------------------------------*/
    if (data.donor_id) {
      data.donor_id_code = data.donor_id;
      delete data.donor_id;
    }

    if (data.type) {
      data.donor_type = data.type;
      delete data.type;
    }

    /* -------------------------------
       4️⃣ UPDATE MAIN DONOR
    --------------------------------*/
    await conn.query(
      `UPDATE donors SET ? WHERE id = ?`,
      [data, donorId]
    );

    /* -------------------------------
       5️⃣ REPLACE DONATIONS
    --------------------------------*/
    await conn.query(
      `DELETE FROM donations WHERE donor_id = ?`,
      [donorId]
    );

    for (const don of donations) {
      await conn.query(
        `
        INSERT INTO donations
        (donor_id, donation_date, transaction_id, purpose, receipt_number,
         receipt_80g_issued, acknowledgment_sent, donor_feedback, remarks, amount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          donorId,
          don.donation_date || null,
          don.transaction_id || null,
          don.purpose || null,
          don.receipt_number || null,
          don.receipt_80g_issued || null,
          don.acknowledgment_sent || null,
          don.donor_feedback || null,
          don.remarks || null,
          don.amount || 0
        ]
      );
    }

    await conn.commit();

    res.json({ message: "Donor updated successfully" });

  } catch (err) {
    await conn.rollback();
    console.error(err);

    if (err.code === "ER_DUP_ENTRY") {
      if (err.message.includes("uq_donors_email")) {
        return res.status(409).json({
          field: "email",
          message: "Email already exists"
        });
      }
      if (err.message.includes("uq_donors_contact")) {
        return res.status(409).json({
          field: "contact_number",
          message: "Contact number already exists"
        });
      }
    }

    res.status(500).json({ message: "Internal server error" });
  } finally {
    conn.release();
  }
};
