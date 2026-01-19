import { db } from "../config/db.js";
import { generateId } from "../utils/idGenerator.js";

export const createFinanceReport = async (req, res) => {
  console.log("🚀 createFinanceReport CALLED");

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const data = { ...req.body };

    // pull subform
    const transactions = data.transactions || [];

    // remove from main payload
    delete data.transactions;

    // generate main id
    data.id = await generateId("FIN", "finance_reports");

    // insert finance report
    await conn.query(
      `INSERT INTO finance_reports SET ?`,
      data
    );

    // insert transactions
    for (const t of transactions) {
      await conn.query(
        `INSERT INTO finance_transactions 
          (finance_report_id, transaction_date, entity_name, income_amount,
           expense_amount, bill_transaction_id, gst_amount, remarks, other_details)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.id,
          t.transaction_date || null,
          t.entity_name || null,
          t.income_amount || 0,
          t.expense_amount || 0,
          t.bill_transaction_id || null,
          t.gst_amount || 0,
          t.remarks || null,
          t.other_details || null
        ]
      );
    }

    await conn.commit();

    res.status(201).json({
      id: data.id,
      message: "Finance report created successfully"
    });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const getFinanceReportDetail = async (req, res) => {
  try {
    const reportId = req.params.id;

    const [reports] = await db.query(
      'SELECT * FROM finance_reports WHERE id = ?',
      [reportId]
    );

    if (!reports.length) return res.sendStatus(404);

    const [transactions] = await db.query(
      `SELECT 
          id,
          finance_report_id,
          DATE_FORMAT(transaction_date, '%Y-%m-%d') AS transaction_date,
          entity_name,
          income_amount,
          expense_amount,
          bill_transaction_id,
          gst_amount,
          remarks,
          other_details
       FROM finance_transactions
       WHERE finance_report_id = ?
       ORDER BY transaction_date DESC`,
      [reportId]
    );

    transactions.forEach(t => {
      if (t.transaction_date) {
        t.transaction_date = t.transaction_date.toString().substring(0, 10);
      }
    });

    res.json({
      ...reports[0],
      transactions
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};




export const updateFinanceReport = async (req, res) => {
  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const reportId = req.params.id;
    const data = { ...req.body };

    /* -----------------------------
       1️⃣ EXTRACT SUBFORM
    ------------------------------*/
    const transactions = data.transactions || [];
    delete data.transactions;

    /* -----------------------------
       2️⃣ AUDIT FIELDS (optional)
    ------------------------------*/
    data.modified_by = "System";
    data.modified_date = new Date();

    delete data.created_by;
    delete data.created_by_date;

    /* -----------------------------
       3️⃣ UPDATE FINANCE REPORT
    ------------------------------*/
    await conn.query(
      `UPDATE finance_reports SET ? WHERE id = ?`,
      [data, reportId]
    );

    /* -----------------------------
       4️⃣ DELETE OLD TRANSACTIONS
    ------------------------------*/
    await conn.query(
      `DELETE FROM finance_transactions WHERE finance_report_id = ?`,
      [reportId]
    );

    /* -----------------------------
       5️⃣ INSERT TRANSACTIONS AGAIN
    ------------------------------*/
    for (const t of transactions) {
      await conn.query(
        `INSERT INTO finance_transactions
          (finance_report_id, transaction_date, entity_name,
           income_amount, expense_amount, bill_transaction_id,
           gst_amount, remarks, other_details)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          reportId,
          t.transaction_date || t.date || null,
          t.entity_name || t.name || null,
          t.income_amount || 0,
          t.expense_amount || 0,
          t.bill_transaction_id || null,
          t.gst_amount || t.gst || 0,
          t.remarks || null,
          t.other_details || null
        ]
      );
    }

    await conn.commit();

    res.json({
      id: reportId,
      message: "Finance report updated successfully"
    });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};
