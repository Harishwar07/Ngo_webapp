
import type React from 'react';

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'date' | 'header' | 'file';
  required?: boolean;
  default_value?: string | number;
  options?: string[];
}

export interface SubformDefinition {
    key: string;
    label: string;t
    fields: FormField[];
}

export interface FilterDefinition {
  key: string;
  label: string;
  type: 'az' | 'text' | 'dropdown' | 'range' | 'daterange';
  options?: string[];
}

export interface FrfEntity {
  id: 'students' | 'volunteers' | 'donors' | 'board_members' | 'projects' | 'finance_reports';
  name: string;
  icon: React.ReactNode;
  summary_fields: string[];
  create_fields?: FormField[];
  sub_forms?: SubformDefinition[];
  filters?: FilterDefinition[];
}

// Base record with common administrative fields from PDFs
interface BaseFrfRecord {
  id: string;
  email: string;
  secondary_email?: string;
  email_opt_out: 'Yes' | 'No';
  created_by: string;
  created_by_date: string;
  modified_by: string;
  modified_date: string; // ISO string
}

// --- Student FRF ---
export interface StudentSessionLog {
  date: string;
  course: string;
  topic_covered: string;
  interest_level: string;
  challenges_faced: string;
  understanding_level: number; // 1-5 Scale
  overall_score: number;
  remarks: string;
  feedback: string;
  home_work: string;
}

export interface Student extends BaseFrfRecord {
  student_frf_name: string;
  student_frf_owner: string;
  // Personal Info
  date_of_birth: string;
  father_name: string;
  blood_group: string;
  mother_name: string;
  parents_contact_number: string;
  address: string;
  monthly_income: number;
  permanent_address: string;
  // Education
  class_name: string;
  section: string;
  medium: string;
  school: string;
  // Subform
  session_logs: StudentSessionLog[];
  // Calculated field for summary/filtering
  avg_overall_score?: number;
}

// --- Volunteer FRF ---
export interface VolunteerAttendance {
  date: string;
  attendance: 'Present' | 'Absent';
  performance: number;
  remarks: string;
}

export interface Volunteer extends BaseFrfRecord {
  volunteer_frf_name: string;
  volunteer_frf_owner: string;
  volunteer_id_code: string;
  // Personal Info
  gender: 'Male' | 'Female' | 'Other';
  date_of_birth: string;
  father_name: string;
  mother_name: string;
  contact_number: string;
  emergency_contact_number: string;
  address: string;
  blood_group: string;
  // Work Info
  company_name: string;
  experience: string;
  skill: string;
  // Proof Details
  id_proof_type: string;
  id_number: string;
  joining_date: string;
  proof_file_upload: string | File | null; // URL
  // Subform
  attendance: VolunteerAttendance[];
}

// --- Donor FRF ---
export interface DonationDetail {
  date: string;
  transaction_id: string;
  purpose: string;
  receipt_number: string;
  '80G_receipt_issued': 'Yes' | 'No';
  acknowledgment_sent: 'Yes' | 'No';
  donor_feedback: string;
  remarks: string;
  amount: number;
}

export interface Donor extends BaseFrfRecord {
  donor_frf_name: string;
  donor_frf_owner: string;
  // Donor Details
  donor_id_code: string;
  donor_type: 'Individual' | 'Corporate';
  contact_person?: string; // For company
  contact_number: string;
  address: string;
  // Subform
  donations: DonationDetail[];
}

// --- Board of Trustees FRF ---
export interface BoardMember extends BaseFrfRecord {
  board_frf_name: string;
  board_frf_owner: string;
  
  // Personal Info
  gender: 'Male' | 'Female' | 'Other';
  date_of_birth: string;
  contact_number: string;
  emergency_contact_number: string;
  blood_group: string;
  father_name: string;
  mother_name: string;
  address: string;

  // Proof Details
  id_proof_type: string;
  id_number: string;
  joining_date: string;
  proof_file_upload: string | File | null;

  // Role
  designation: 'Chairperson' | 'Treasurer' | 'Secretary' | 'Member';
  role_description: string;
  
  tenure_end?: string;
}

// --- Project FRF ---
export interface ProjectAttendanceLog {
    date: string;
    attent_list: string;
    absent_list: string;
    overall_summary: string;
    remarks: string;
}

export interface Project extends BaseFrfRecord {
  project_frf_name: string;
  project_frf_owner: string;
  // Project Details
  project_name: string;
  project_id_code: string;
  start_date: string;
  duration: string;
  objective: string;
  budget: number;
  budget_utilized: number;
  impact_summary: string;
  end_date?: string;
  location_name: string;
  target_group: string;
  responsible_officer: string;
  status: 'Planning' | 'Ongoing' | 'Completed' | 'On-Hold';
  // Subform
  attendance_logs: ProjectAttendanceLog[];
}

// --- Finance Report FRF ---
export interface FinanceTransaction {
  date: string;
  name: string;
  income_amount: number;
  expense_amount: number;
  bill_transaction_id: string;
  gst: number;
  remarks: string;
  other_details: string;
}

export interface FinanceReport extends BaseFrfRecord {
  finance_report_frf_name: string;
  finance_report_frf_owner: string;
  project_name: string;
  // Subform
  transactions: FinanceTransaction[];
}

export type AnyRecord = Student | Volunteer | Donor | BoardMember | Project | FinanceReport;
