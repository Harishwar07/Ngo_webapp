
import React from 'react';
import type { FrfEntity } from './types';

// SVG Icons as JSX Components
export const STUDENTS_ICON = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0121.482 12c.324-.02.645-.047.965-.084m-10.447 2.084a12.083 12.083 0 01-5.456-1.043m10.912 2.086A12.083 12.083 0 0112 21.75c-2.676 0-5.14-1-7.022-2.657" /></svg>
);
export const VOLUNTEERS_ICON = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);
export const DONORS_ICON = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
);
export const BOARD_ICON = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
export const PROJECTS_ICON = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
export const FINANCE_ICON = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
);

export const NGO_ICON = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.704 4.144a9.026 9.026 0 011.15-1.596 9.027 9.027 0 013.336-2.149 9.027 9.027 0 013.465 0 9.027 9.027 0 013.336 2.15 9.026 9.026 0 011.15 1.595M12 21v-6m0 0l-3-3m3 3l3-3" /></svg>
)

export const FRF_ENTITIES: FrfEntity[] = [
  { 
    id: 'students', 
    name: 'Students', 
    icon: STUDENTS_ICON, 
    summary_fields: ['student_frf_name', 'class_name', 'section', 'student_frf_owner'],
    filters: [
      { key: 'student_frf_name', label: 'Student Name', type: 'az' },
      { key: 'class_name', label: 'Class', type: 'dropdown', options: ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9'] },
      { key: 'section', label: 'Section', type: 'dropdown', options: ['A', 'B', 'C', 'D'] },
      { key: 'student_frf_owner', label: 'Frf Owner', type: 'text' },
    ],
    create_fields: [
      // Student FRF Information
      { key: 'header_frf_info', label: 'Student FRF Information', type: 'header' },
      { key: 'student_frf_name', label: 'Student FRF Name', type: 'text', required: true },
      { key: 'student_frf_owner', label: 'Student FRF Owner', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'text', required: true },
      { key: 'secondary_email', label: 'Secondary Email', type: 'text' },
      { key: 'email_opt_out', label: 'Email Opt Out', type: 'select', options: ['Yes', 'No'] },

      // Personal Information
      { key: 'header_personal_info', label: 'Personal Information', type: 'header' },
      { key: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
      { key: 'father_name', label: 'Father Name', type: 'text' },
      { key: 'mother_name', label: 'Mother Name', type: 'text' },
      { key: 'blood_group', label: 'Blood Group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
      { key: 'parents_contact_number', label: 'Parents Contact Number', type: 'text', required: true },
      { key: 'monthly_income', label: 'Monthly Income', type: 'number' },
      { key: 'address', label: 'Address', type: 'textarea' },
      { key: 'permanent_address', label: 'Permanent Address', type: 'textarea' },

      // Education
      { key: 'header_education', label: 'Education', type: 'header' },
      { key: 'class_name', label: 'Class', type: 'select', options: ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9'], required: true },
      { key: 'section', label: 'Section', type: 'select', options: ['A', 'B', 'C', 'D'], required: true },
      { key: 'medium', label: 'Medium', type: 'select', options: ['English', 'Tamil', 'Hindi'] },
      { key: 'school', label: 'School', type: 'text', required: true },
    ],
    sub_forms: [
        {
            key: 'student_session_logs',
            label: 'Session Logs',
            t: 'student_session_logs',
            fields: [
                { key: 'session_date', label: 'Date', type: 'date', required: true },
                { key: 'course', label: 'Course', type: 'text', required: true },
                { key: 'topic_covered', label: 'Topic Covered', type: 'text' },
                { key: 'interest_level', label: 'Interest Level', type: 'select', options: ['High', 'Medium', 'Low'] },
                { key: 'challenges_faced', label: 'Challenges Faced', type: 'text' },
                { key: 'understanding_level', label: 'Understanding (1-5)', type: 'number' },
                { key: 'overall_score', label: 'Overall Score', type: 'number' },
                { key: 'remarks', label: 'Remarks', type: 'text' },
                { key: 'feedback', label: 'Feedback', type: 'text' },
                { key: 'home_work', label: 'Homework', type: 'text' },
            ]
        }
    ]
  },
  { 
    id: 'volunteers', 
    name: 'Volunteers', 
    icon: VOLUNTEERS_ICON, 
    summary_fields: ['volunteer_frf_name', 'email', 'volunteer_frf_owner', 'modified_date'],
    filters: [
        { key: 'volunteer_frf_name', label: 'Volunteer Name', type: 'az' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'volunteer_frf_owner', label: 'FRF Owner', type: 'text' },
        { key: 'modified_date', label: 'Modified Time', type: 'daterange' },
    ],
    create_fields: [
      // Volunteer FRF Information
      { key: 'header_frf_info', label: 'Volunteer FRF Information', type: 'header' },
      { key: 'volunteer_frf_name', label: 'Volunteer FRF Name', type: 'text', required: true },
      { key: 'volunteer_frf_owner', label: 'Volunteer FRF Owner', type: 'text', required: true },
      { key: 'volunteer_id_code', label: 'Volunteer ID', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'text', required: true },
      { key: 'secondary_email', label: 'Secondary Email', type: 'text' },
      { key: 'email_opt_out', label: 'Email Opt Out', type: 'select', options: ['Yes', 'No'] },

      // Personal Information
      { key: 'header_personal_info', label: 'Personal Information', type: 'header' },
      { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
      { key: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
      { key: 'father_name', label: 'Father Name', type: 'text' },
      { key: 'mother_name', label: 'Mother Name', type: 'text' },
      { key: 'contact_number', label: 'Contact Number', type: 'text', required: true },
      { key: 'emergency_contact_number', label: 'Emergency Contact Number', type: 'text' },
      { key: 'address', label: 'Address', type: 'textarea' },
      { key: 'blood_group', label: 'Blood Group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },

      // Work Information
      { key: 'header_work_info', label: 'Work Information', type: 'header' },
      { key: 'company_name', label: 'Company Name', type: 'text' },
      { key: 'experience', label: 'Experience', type: 'text' },
      { key: 'skill', label: 'Skill', type: 'select', options: ['Teaching', 'Event Management', 'Mentoring', 'Fundraising'], required: true },

      // Proof Details
      { key: 'header_proof_details', label: 'Proof Details', type: 'header' },
      { key: 'id_proof_type', label: 'ID Proof Type', type: 'text' },
      { key: 'id_number', label: 'ID Number', type: 'text' },
      { key: 'joining_date', label: 'Joining Date', type: 'date', required: true },
      { key: 'proof_file_url', label: 'Proof File Upload', type: 'file' },
    ],
    sub_forms: [
        {
            key: 'volunteer_attendance',
            label: 'Attendance & Performance',
            t: 'attendance',
            fields: [
                { key: 'attendance_date', label: 'Date', type: 'date', required: true },
                { key: 'attendance_status', label: 'Attendance', type: 'select', options: ['Present', 'Absent'], required: true },
                { key: 'performance', label: 'Performance', type: 'number' },
                { key: 'remarks', label: 'Remarks', type: 'text' }
            ]
        }
    ]
  },
  { 
    id: 'donors', 
    name: 'Donors', 
    icon: DONORS_ICON, 
    summary_fields: ['donor_frf_name', 'email', 'donor_frf_owner', 'modified_date'],
    filters: [
        { key: 'donor_frf_name', label: 'Donor Name', type: 'az' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'donor_frf_owner', label: 'FRF Owner', type: 'text' },
        { key: 'modified_date', label: 'Modified Time', type: 'daterange' },
    ],
    create_fields: [
      // Donor FRF Information
      { key: 'header_frf_info', label: 'Donor FRF Information', type: 'header' },
      { key: 'donor_frf_name', label: 'Donor FRF Name', type: 'text', required: true },
      { key: 'donor_frf_owner', label: 'Donor FRF Owner', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'text', required: true },
      { key: 'secondary_email', label: 'Secondary Email', type: 'text' },
      { key: 'email_opt_out', label: 'Email Opt Out', type: 'select', options: ['Yes', 'No'] },

      // Donors Details
      { key: 'header_donor_details', label: 'Donors Details', type: 'header' },
      { key: 'donor_id_code', label: 'Donor ID', type: 'text', required: true },
      { key: 'donor_type', label: 'Type', type: 'select', options: ['Individual', 'Corporate'], required: true },
      { key: 'contact_person', label: 'Contact Person (For company)', type: 'text' },
      { key: 'contact_number', label: 'Contact Number', type: 'text', required: true },
      { key: 'address', label: 'Address', type: 'textarea' },
    ],
    sub_forms: [
        {
            key: 'donations',
            label: 'Donations',
            t: 'donations',
            fields: [
                { key: 'donation_date', label: 'Date', type: 'date', required: true },
                { key: 'transaction_id', label: 'Transaction ID', type: 'text', required: true },
                { key: 'purpose', label: 'Purpose', type: 'text' },
                { key: 'receipt_number', label: 'Receipt No', type: 'text' },
                { key: 'receipt_80g_issued', label: '80G Receipt Issued', type: 'select', options: ['Yes', 'No'] },
                { key: 'acknowledgment_sent', label: 'Acknowledgement Sent', type: 'select', options: ['Yes', 'No'] },
                { key: 'donor_feedback', label: 'Feedback', type: 'text' },
                { key: 'remarks', label: 'Remarks', type: 'text' },
                { key: 'amount', label: 'Amount', type: 'number', required: true },
            ]
        }
    ]
  },
  { 
    id: 'board_members', 
    name: 'Board of Trustees', 
    icon: BOARD_ICON, 
    summary_fields: ['board_frf_name', 'email', 'board_frf_owner', 'modified_date'],
    filters: [
        { key: 'board_frf_name', label: 'Board Member Name', type: 'az' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'board_frf_owner', label: 'FRF Owner', type: 'text' },
        { key: 'modified_date', label: 'Modified Time', type: 'daterange' },
    ],
    create_fields: [
      // Board of Trustees FRF Information
      { key: 'header_frf_info', label: 'Board of Trustees FRF Information', type: 'header' },
      { key: 'board_frf_name', label: 'Board of Trustees FRF Name', type: 'text', required: true },
      { key: 'board_frf_owner', label: 'Board of Trustees FRF Owner', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'text', required: true },
      { key: 'secondary_email', label: 'Secondary Email', type: 'text' },
      { key: 'email_opt_out', label: 'Email Opt Out', type: 'select', options: ['Yes', 'No'] },

      // Personal Information
      { key: 'header_personal_info', label: 'Personal Information', type: 'header' },
      { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
      { key: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
      { key: 'contact_number', label: 'Contact Number', type: 'text', required: true },
      { key: 'emergency_contact_number', label: 'Emergency Contact Number', type: 'text' },
      { key: 'blood_group', label: 'Blood Group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
      { key: 'father_name', label: 'Father Name', type: 'text' },
      { key: 'mother_name', label: 'Mother Name', type: 'text' },
      { key: 'address', label: 'Address', type: 'textarea' },

      // Proof Details
      { key: 'header_proof_details', label: 'Proof Details', type: 'header' },
      { key: 'id_proof_type', label: 'ID Proof Type', type: 'text' },
      { key: 'id_number', label: 'ID Number', type: 'text' },
      { key: 'joining_date', label: 'Joining Date', type: 'date', required: true },
      { key: 'proof_file_url', label: 'Proof File Upload', type: 'file' },

      // Role
      { key: 'header_role', label: 'Role', type: 'header' },
      { key: 'designation', label: 'Designation', type: 'select', options: ['Chairperson', 'Treasurer', 'Secretary', 'Member'], required: true },
      { key: 'role_description', label: 'Role Description', type: 'textarea' },
    ]
  },
  { 
    id: 'projects', 
    name: 'Projects', 
    icon: PROJECTS_ICON, 
    summary_fields: ['project_frf_name', 'email', 'project_frf_owner', 'modified_date'],
    filters: [
        { key: 'project_frf_name', label: 'Project Name', type: 'az' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'project_frf_owner', label: 'FRF Owner', type: 'text' },
        { key: 'modified_date', label: 'Modified Time', type: 'daterange' },
    ],
    create_fields: [
      // Project FRF Information
      { key: 'header_frf_info', label: 'Project FRF Information', type: 'header' },
      { key: 'project_frf_name', label: 'Project FRF Name', type: 'text', required: true },
      { key: 'project_frf_owner', label: 'Project FRF Owner', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'text', required: true },
      { key: 'secondary_email', label: 'Secondary Email', type: 'text' },
      { key: 'email_opt_out', label: 'Email Opt Out', type: 'select', options: ['Yes', 'No'] },

      // Project Details
      { key: 'header_project_details', label: 'Project Details', type: 'header' },
      { key: 'project_name', label: 'Project Name', type: 'text', required: true },
      { key: 'project_id_code', label: 'Project ID', type: 'text', required: true },
      { key: 'start_date', label: 'Start Date', type: 'date', required: true },
      { key: 'end_date', label: 'End Date', type: 'date' },
      { key: 'duration', label: 'Duration', type: 'text' },
      { key: 'project_status', label: 'Status', type: 'select', options: ['Planning', 'Ongoing', 'Completed', 'On-Hold'], required: true },
      { key: 'objective', label: 'Objective', type: 'textarea' },
      { key: 'budget', label: 'Budget', type: 'number' },
      { key: 'budget_utilized', label: 'Budget Utilized', type: 'number' },
      { key: 'impact_summary', label: 'Impact Summary', type: 'textarea' },
      { key: 'location_name', label: 'Location', type: 'text', required: true },
      { key: 'target_group', label: 'Target Group', type: 'text' },
      { key: 'responsible_officer', label: 'Responsible Officer', type: 'text', required: true },
    ],
    sub_forms: [
        {
            key: 'project_attendance_logs',
            label: 'Attendance Logs',
            t: 'attendance_logs',
            fields: [
                { key: 'log_date', label: 'Date', type: 'date', required: true },
                { key: 'attent_list', label: 'Attended', type: 'text' },
                { key: 'absent_list', label: 'Absent', type: 'text' },
                { key: 'overall_summary', label: 'Overall Summary', type: 'text' },
                { key: 'remarks', label: 'Remarks', type: 'text' }
            ]
        }
    ]
  },
  { 
    id: 'finance_reports', 
    name: 'Finance Reports', 
    icon: FINANCE_ICON, 
    summary_fields: ['finance_report_frf_name', 'email', 'finance_report_frf_owner', 'modified_date'],
    filters: [
        { key: 'finance_report_frf_name', label: 'Report Name', type: 'az' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'finance_report_frf_owner', label: 'FRF Owner', type: 'text' },
        { key: 'modified_date', label: 'Modified Time', type: 'daterange' },
    ],
    create_fields: [
      { key: 'header_frf_info', label: 'Finance Report FRF Information', type: 'header' },
      { key: 'finance_report_frf_name', label: 'Finance Report FRF Name', type: 'text', required: true },
      { key: 'finance_report_frf_owner', label: 'Finance Report FRF Owner', type: 'text', required: true },
      { key: 'project_name', label: 'Project Name', type: 'text', required: true },
      { key: 'created_by', label: 'Created By', type: 'text' },
      { key: 'created_by_date', label: 'Created Date', type: 'date' },
      { key: 'modified_by', label: 'Modified By', type: 'text' },
      { key: 'modified_date', label: 'Modified Date', type: 'date' },
      { key: 'email', label: 'Email', type: 'text', required: true },
      { key: 'secondary_email', label: 'Secondary Email', type: 'text' },
      { key: 'email_opt_out', label: 'Email Opt Out', type: 'select', options: ['Yes', 'No'] },
    ],
    sub_forms: [
        {
            key: 'finance_transactions',
            label: 'Transactions',
            t: 'transactions',
            fields: [
                { key: 'transaction_date', label: 'Date', type: 'date', required: true },
                { key: 'entity_name', label: 'Name', type: 'text', required: true },
                { key: 'income_amount', label: 'Income', type: 'number' },
                { key: 'expense_amount', label: 'Expense', type: 'number' },
                { key: 'bill_transaction_id', label: 'Bill/Txn ID', type: 'text' },
                { key: 'gst_amount', label: 'GST', type: 'number' },
                { key: 'remarks', label: 'Remarks', type: 'text' },
                { key: 'other_details', label: 'Other Details', type: 'text' }
            ]
        }
    ]
  },
];