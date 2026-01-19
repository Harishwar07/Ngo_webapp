import React, { useEffect, useState } from 'react';
import type {
  FrfEntity,
  AnyRecord,
  Student,
  Donor,
  Volunteer,
  Project,
  FinanceReport,
  BoardMember
} from '../types';
import { fetch_frf_detail } from '../services/mockApi';

/* ----------------------------------------------------
   SAFETY HELPERS (CRITICAL)
---------------------------------------------------- */
const safeArray = <T,>(v?: T[]): T[] => (Array.isArray(v) ? v : []);
const safeNum = (v: any) => {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};


/* ----------------------------------------------------
   UI HELPERS
---------------------------------------------------- */
const DetailCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children
}) => (
  <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
    <h3 className="text-lg md:text-xl font-bold text-gray-800 border-b-2 border-indigo-100 pb-3 mb-4">
      {title}
    </h3>
    {children}
  </div>
);

const KeyValueGrid: React.FC<{ data: Record<string, any> }> = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
    {Object.entries(data).map(([key, value]) => (
      <div key={key}>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {key.replace(/_/g, ' ')}
        </p>
        <p className="text-sm text-gray-900 break-words">
          {value ?? 'N/A'}
        </p>
      </div>
    ))}
  </div>
);

const SubformTable: React.FC<{
  columns: { key: string; label: string }[];
  data: any[];
  summary?: React.ReactNode;
}> = ({ columns, data, summary }) => {
  const rows = safeArray(data);

  if (!rows.length) {
    return <p className="text-sm text-gray-500 italic">No records found</p>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto mt-3">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(c => (
                <th key={c.key} className="p-2 text-xs font-semibold text-gray-600 uppercase">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row, i) => (
              <tr key={i}>
                {columns.map(c => (
                  <td key={c.key} className="p-2 text-sm">
                    {row?.[c.key] ?? '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {summary && (
        <div className="mt-3 text-right text-sm font-semibold text-indigo-700">
          {summary}
        </div>
      )}
    </div>
  );
};

const OverviewCard: React.FC<{ name: string; owner: string; email: string; modified_by?: string }> = ({
  name,
  owner,
  email,
  modified_by
}) => (
  <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
    <h2 className="text-xl md:text-2xl font-bold">{name}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm text-gray-600">
      <p><b>Owner:</b> {owner}</p>
      <p><b>Email:</b> {email}</p>
      <p><b>Modified By:</b> {modified_by ?? '-'}</p>
    </div>
  </div>
);

/* ----------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------- */
interface DetailViewProps {
  entity: FrfEntity;
  id: string;
  reloadKey: number;   // 👈 ADD THIS
  on_back: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ entity, id, reloadKey, on_back }) => {
  const [record, setRecord] = useState<AnyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch_frf_detail(entity.id, id)
        .then(setRecord)
        .catch(() => setError('Failed to load details'))
        .finally(() => setLoading(false));
    }, [entity.id, id, reloadKey]);



  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!record) return <div className="p-10 text-center text-red-500">Record not found</div>;

  /* ------------------------------------------------
     ENTITY-SPECIFIC RENDERING
  ------------------------------------------------ */
  const renderContent = () => {
    /* ================= STUDENT ================= */
    if (entity.id === 'students') {
      const s = record as Student;
      const logs = safeArray(s.session_logs);
      const avg =
        logs.length > 0
          ? logs.reduce((a, b) => a + safeNum(b.overall_score), 0) / logs.length
          : 0;

      return (
          <>
            <OverviewCard name={s.student_frf_name} owner={s.student_frf_owner} email={s.email} modified_by={s.modified_by} />
            <DetailCard title="Student FRF Information">
              <KeyValueGrid data={{ student_frf_name: s.student_frf_name, student_frf_owner: s.student_frf_owner, created_by: s.created_by, created_date: s.created_by_date?.substring(0,10), modified_by: s.modified_by, modified_date: new Date(s.modified_date).toLocaleDateString(), email: s.email, secondary_email: s.secondary_email, email_opt_out: s.email_opt_out }} />
            </DetailCard>
            <DetailCard title="Personal Information">
              <KeyValueGrid data={{ date_of_birth: s.date_of_birth, father_name: s.father_name, blood_group: s.blood_group, mother_name: s.mother_name, parents_contact_number: s.parents_contact_number, address: s.address, monthly_income: `₹${s.monthly_income}`, permanent_address: s.permanent_address }} />
            </DetailCard>
             <DetailCard title="Education">
              <KeyValueGrid data={{ class_name: s.class_name, section: s.section, medium: s.medium, school: s.school }} />
            </DetailCard>
            <DetailCard title="Session Logs">
                <SubformTable 
                    columns={[
                        { key: 'session_date', label: 'Date' },
                        { key: 'course', label: 'Course' },
                        { key: 'topic_covered', label: 'Topic Covered' },
                        { key: 'interest_level', label: 'Interest Level' },
                        { key: 'challenges_faced', label: 'Challenges Faced' },
                        { key: 'understanding_level', label: 'Understanding (1-5)' },
                        { key: 'overall_score', label: 'Score' },
                        { key: 'remarks', label: 'Remarks' },
                        { key: 'feedback', label: 'Feedback' },
                        { key: 'home_work', label: 'Homework' }
                        ]}

                    data={logs}
                    summary={`AVG Overall Score: ${avg.toFixed(2)}`}
                />          
            </DetailCard>
        </>
      );
    }

    /* ================= VOLUNTEER ================= */
    if (entity.id === 'volunteers') {
      const v = record as Volunteer;
      const attendanceRows = safeArray(v.attendance);
      const avgPerformance = attendanceRows.length
            ? attendanceRows.reduce((sum, row) => sum + safeNum(row.performance), 0) / attendanceRows.length
            : 0;

      return (
              <>
                  <OverviewCard name={v.volunteer_frf_name} owner={v.volunteer_frf_owner} email={v.email} modified_by={v.modified_by} />
                  <DetailCard title="Volunteer FRF Information">
                      <KeyValueGrid data={{ volunteer_frf_name: v.volunteer_frf_name, volunteer_frf_owner: v.volunteer_frf_owner, volunteer_id_code: v.volunteer_id_code, created_by: v.created_by, created_date: v.created_by_date?.substring(0,10), modified_by: v.modified_by, modified_date: new Date(v.modified_date).toLocaleDateString(), email: v.email, secondary_email: v.secondary_email, email_opt_out: v.email_opt_out }} />
                  </DetailCard>
                  <DetailCard title="Personal Information">
                      <KeyValueGrid data={{ gender: v.gender, date_of_birth: v.date_of_birth, father_name: v.father_name, mother_name: v.mother_name, contact_number: v.contact_number, emergency_contact_number: v.emergency_contact_number, address: v.address, blood_group: v.blood_group }} />
                  </DetailCard>
                  <DetailCard title="Work Information">
                       <KeyValueGrid data={{ company_name: v.company_name, experience: v.experience, skill: v.skill }} />
                  </DetailCard>
                  <DetailCard title="Proof Details">
                       <KeyValueGrid data={{ id_proof_type: v.id_proof_type, id_number: v.id_number, joining_date: v.joining_date, proof_file: '' }} />
                        {record.proof_file_url && (
                                <a
                                    href={`https://localhost:3001${record.proof_file_url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 underline"
                                >
                                    View Proof Document
                                </a>
                        )}

                  </DetailCard>
                  <DetailCard title="Attendance & Performance">
                      <SubformTable
                          columns={[{ key: 'attendance_date', label: 'Date' }, { key: 'attendance_status', label: 'Attendance' }, { key: 'performance', label: 'Performance' }, { key: 'remarks', label: 'Remarks' }]}
                          data={attendanceRows}
                          summary={`Avg Performance: ${avgPerformance.toFixed(2)}`}
                      />          
                    </DetailCard>
        </>
      );
    }

    /* ================= DONOR ================= */
    if (entity.id === 'donors') {
      const d = record as Donor;
      const donations = safeArray(d.donations);
      const total = donations.reduce((a, b) => a + safeNum(b.amount), 0);

      return (
              <>
                  <OverviewCard name={d.donor_frf_name} owner={d.donor_frf_owner} email={d.email} modified_by={d.modified_by} />
                  <DetailCard title="Donor FRF Information">
                      <KeyValueGrid data={{ donor_frf_name: d.donor_frf_name, donor_frf_owner: d.donor_frf_owner, created_by: d.created_by, created_date: d.created_by_date?.substring(0,10), modified_by: d.modified_by, modified_date: new Date(d.modified_date).toLocaleDateString(), email: d.email, secondary_email: d.secondary_email, email_opt_out: d.email_opt_out }} />
                  </DetailCard>
                  <DetailCard title="Donors Details">
                      <KeyValueGrid data={{ donor_id_code: d.donor_id_code, donor_type: d.donor_type, contact_person: d.contact_person, contact_number: d.contact_number, address: d.address }} />
                  </DetailCard>
                  <DetailCard title="Donor Transactions">
                      <SubformTable
                          columns={[
                              { key: 'donation_date', label: 'Date' }, { key: 'transaction_id', label: 'Transaction ID' }, { key: 'purpose', label: 'Purpose' }, { key: 'receipt_number', label: 'Receipt No.' }, { key: 'receipt_80g_issued', label: '80G Receipt Issued' }, { key: 'acknowledgment_sent', label: 'Acknowledgement Sent' }, { key: 'donor_feedback', label: 'Feedback' }, { key: 'remarks', label: 'Remarks' }, { key: 'amount', label: 'Amount' }
                          ]}
                          data={donations.map(dn => {
                            const amountNumber = Number(dn.amount) || 0;

                            return {
                                ...dn,
                                amount: `₹${amountNumber.toFixed(2)}`
                            };
                            })}
                          summary={`Total: ₹${total.toFixed(2)}`}
                          />          
                    </DetailCard>
        </>
      );
    }

    /* ================= PROJECT ================= */
    if (entity.id === 'projects') {
      const p = record as Project;
      const logs = safeArray(p.attendance_logs);

      return (
            <>
                <OverviewCard name={p.project_frf_name} owner={p.project_frf_owner} email={p.email} modified_by={p.modified_by} />
                 <DetailCard title="Project FRF Information">
                    <KeyValueGrid data={{ project_frf_name: p.project_frf_name, project_frf_owner: p.project_frf_owner, created_by: p.created_by, created_date: p.created_by_date?.substring(0,10), modified_by: p.modified_by, modified_date: new Date(p.modified_date).toLocaleDateString(), email: p.email, secondary_email: p.secondary_email, email_opt_out: p.email_opt_out }} />
                </DetailCard>
                <DetailCard title="Project Details">
                    <KeyValueGrid data={{ project_name: p.project_name, project_id_code: p.project_id_code, start_date: p.start_date, end_date: p.end_date, duration: p.duration, objective: p.objective, budget: `₹${safeNum(p.budget).toFixed(2)}`, budget_utilized: `₹${safeNum(p.budget_utilized).toFixed(2)}`, impact_summary: p.impact_summary, location_name: p.location_name, target_group: p.target_group, responsible_officer: p.responsible_officer }} />
                </DetailCard>
                <DetailCard title="Attendance Log">
                    <SubformTable 
                      columns={[{ key: 'log_date', label: 'Date' }, { key: 'attent_list', label: 'Attended' }, { key: 'absent_list', label: 'Absent' }, { key: 'overall_summary', label: 'Overall' }, { key: 'remarks', label: 'Remarks' }]} 
                      data={logs} 
                      summary={`Avg Overall: N/A`}
                    />          
                </DetailCard>
        </>
      );
    }

    /* ================= FINANCE ================= */
    if (entity.id === 'finance_reports') {
      const r = record as FinanceReport;
      const txns = safeArray(r.transactions);
      const total_income = txns.reduce((a, t) => a + safeNum(t.income_amount), 0);
      const total_expense = txns.reduce((a, t) => a + safeNum(t.expense_amount), 0);

      return (
          <>
              <OverviewCard name={r.finance_report_frf_name} owner={r.finance_report_frf_owner} email={r.email} modified_by={r.modified_by} />
              <DetailCard title="Finance FRF Information">
                  <KeyValueGrid data={{ 
                      finance_report_frf_name: r.finance_report_frf_name, 
                      finance_report_frf_owner: r.finance_report_frf_owner, 
                      project_name: r.project_name, 
                      created_by: r.created_by,
                      created_date: new Date(r.created_by_date).toLocaleDateString(), 
                      modified_by: r.modified_by,
                      modified_date: new Date(r.modified_date).toLocaleDateString(), 
                      email: r.email, 
                      secondary_email: r.secondary_email, 
                      email_opt_out: r.email_opt_out 
                  }} />
              </DetailCard>
              <DetailCard title="Transaction Ledger">
                  <SubformTable
                      columns={[
                          { key: 'transaction_date', label: 'Date' }, { key: 'entity_name', label: 'Name' }, { key: 'income_amount', label: 'Income' }, { key: 'expense_amount', label: 'Expense' }, { key: 'bill_transaction_id', label: 'Bill/Txn ID' }, { key: 'gst_amount', label: 'GST' }, { key: 'remarks', label: 'Remarks' }, { key: 'other_details', label: 'Other Details' }
                      ]}
                      data={txns.map(t => {
                        const rawIncome = t.income_amount as any;
                        const rawExpense = t.expense_amount as any;

                        const income =
                            typeof rawIncome === 'string'
                            ? Number(rawIncome)
                            : safeNum(rawIncome);

                        const expense =
                            typeof rawExpense === 'string'
                            ? Number(rawExpense)
                            : safeNum(rawExpense);

                        return {
                            ...t,

                            income_amount:
                            rawIncome === null || rawIncome === undefined || rawIncome === ''
                                ? '-'
                                : `₹${income.toFixed(2)}`,

                            expense_amount:
                            rawExpense === null || rawExpense === undefined || rawExpense === ''
                                ? '-'
                                : `₹${expense.toFixed(2)}`
                        };
                        })}




                      summary={
                          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-6">
                              <span>Total Income: <span className="text-green-600">₹{total_income.toFixed(2)}</span></span>
                              <span>Total Expense: <span className="text-red-600">₹{total_expense.toFixed(2)}</span></span>
                              <span>Net: <span className="font-bold">₹{(total_income-total_expense).toFixed(2)}</span></span>
                          </div>
                      }
                  />          
                </DetailCard>
        </>
      );
    }

    /* ================= BOARD ================= */
    if (entity.id === 'board_members') {
      const b = record as BoardMember;

      return (
            <>
                <OverviewCard name={b.board_frf_name} owner={b.board_frf_owner} email={b.email} modified_by={b.modified_by} />
                <DetailCard title="Board of Trustees FRF Information">
                    <KeyValueGrid data={{ board_of_trustees_name: b.board_frf_name, board_of_trustees_frf_owner: b.board_frf_owner, created_by: b.created_by, created_date: b.created_by_date?.substring(0,10), modified_by: b.modified_by, modified_date: new Date(b.modified_date).toLocaleDateString(), email: b.email, secondary_email: b.secondary_email, email_opt_out: b.email_opt_out, }} />
                </DetailCard>
                <DetailCard title="Personal Information">
                    <KeyValueGrid data={{gender: b.gender, date_of_birth: b.date_of_birth, contact_number: b.contact_number, emergency_contact_number: b.emergency_contact_number, blood_group: b.blood_group, father_name: b.father_name, mother_name: b.mother_name, address: b.address, }} />
                </DetailCard>

                <DetailCard title="Proof Details">
                    <KeyValueGrid data={{ id_proof_type: b.id_proof_type, id_number: b.id_number, joining_date: b.joining_date, proof_file: ""}} />
                    {record.proof_file_url && (
                                <a
                                    href={`https://localhost:3001${record.proof_file_url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 underline"
                                >
                                    View Proof Document
                                </a>
                        )}
                </DetailCard>

                <DetailCard title="Role">
                    <KeyValueGrid data={{ designation: b.designation, role_description: b.role_description }} />
                </DetailCard>
        </>
      );
    }

    return <DetailCard title="Details"><KeyValueGrid data={record} /></DetailCard>;
  };

  return (
    <div>
      <button onClick={on_back} className="mb-6 text-indigo-600 font-medium">
        ← Back to {entity.name} List
      </button>
      {renderContent()}
    </div>
  );
};