/* =========================================================
   NGO DATA HUB - SAMPLE SEED DATA
   ========================================================= */

SET FOREIGN_KEY_CHECKS = 0;

/* =========================
   USERS
   ========================= */

/* Super Admin */
INSERT INTO users (
    full_name, email, password_hash, role, is_active, is_approved
) VALUES (
    'System Administrator',
    'admin@ngodatahub.org',
    '$2b$10$EXAMPLEHASHEDPASSWORD1234567890',
    'Super admin',
    1,
    1
);

/* Coordinator */
INSERT INTO users (
    full_name, email, password_hash, role, is_active, is_approved
) VALUES (
    'Project Coordinator',
    'coordinator@ngodatahub.org',
    '$2b$10$EXAMPLEHASHEDPASSWORD1234567890',
    'Coordinator',
    1,
    1
);

/* =========================
   STUDENTS
   ========================= */

INSERT INTO students (
    id, student_frf_name, student_frf_owner,
    email, parents_contact_number,
    class_name, section, school
) VALUES (
    'STU001',
    'Education FRF',
    'NGO Trust',
    'student1@example.com',
    '9000000001',
    'Class 7',
    'A',
    'Government High School'
);

/* =========================
   STUDENT SESSION LOGS
   ========================= */

INSERT INTO student_session_logs (
    student_id, session_date, course,
    topic_covered, interest_level, overall_score
) VALUES (
    'STU001',
    '2025-01-10 10:00:00',
    'Mathematics',
    'Fractions and Decimals',
    'High',
    85
);

/* =========================
   VOLUNTEERS
   ========================= */

INSERT INTO volunteers (
    id, volunteer_frf_name, volunteer_frf_owner,
    volunteer_id_code, email, contact_number,
    date_of_birth, skill, joining_date
) VALUES (
    'VOL001',
    'Volunteer FRF',
    'NGO Trust',
    'VOL-2025-01',
    'volunteer1@example.com',
    '9000000002',
    '1998-05-20',
    'Teaching',
    '2025-01-01'
);

/* =========================
   VOLUNTEER ATTENDANCE
   ========================= */

INSERT INTO volunteer_attendance (
    volunteer_id, attendance_date, attendance_status, performance
) VALUES (
    'VOL001',
    '2025-01-10',
    'Present',
    9
);

/* =========================
   DONORS
   ========================= */

INSERT INTO donors (
    id, donor_frf_name, donor_frf_owner,
    donor_id_code, email, donor_type, contact_number
) VALUES (
    'DON001',
    'Donor FRF',
    'NGO Trust',
    'DON-2025-01',
    'donor1@example.com',
    'Individual',
    '9000000003'
);

/* =========================
   DONATIONS
   ========================= */

INSERT INTO donations (
    donor_id, donation_date, transaction_id,
    amount, receipt_80g_issued
) VALUES (
    'DON001',
    '2025-01-15',
    'TXN-0001',
    5000.00,
    'Yes'
);

/* =========================
   PROJECTS
   ========================= */

INSERT INTO projects (
    id, project_frf_name, project_frf_owner,
    email, project_name, project_id_code,
    start_date, project_status,
    location_name, responsible_officer
) VALUES (
    'PRJ001',
    'Education FRF',
    'NGO Trust',
    'projects@ngodatahub.org',
    'Student Mentorship Program',
    'EDU-2025-01',
    '2025-01-01',
    'Ongoing',
    'Chennai',
    'Project Coordinator'
);

/* =========================
   PROJECT ATTENDANCE LOGS
   ========================= */

INSERT INTO project_attendance_logs (
    project_id, log_date, overall_summary
) VALUES (
    'PRJ001',
    '2025-01-10',
    'Good participation from students and volunteers'
);

/* =========================
   FINANCE REPORT (HEADER)
   ========================= */

INSERT INTO finance_transaction (
    id, finance_report_frf_name, finance_report_frf_owner,
    project_name, email
) VALUES (
    'FINREP001',
    'Finance FRF',
    'NGO Trust',
    'Student Mentorship Program',
    'finance@ngodatahub.org'
);

/* =========================
   FINANCE TRANSACTIONS
   ========================= */

INSERT INTO finance_transactions (
    finance_report_id, transaction_date,
    entity_name, income_amount, remarks
) VALUES (
    'FINREP001',
    '2025-01-15',
    'Donation - DON001',
    5000.00,
    'Donation received for education project'
);

/* =========================
   LOGIN LOGS
   ========================= */

INSERT INTO login_logs (
    user_id, email, status
) VALUES (
    1,
    'admin@ngodatahub.org',
    'SUCCESS'
);

/* =========================
   USER SESSIONS
   ========================= */

INSERT INTO user_sessions (
    user_id, session_id, expires_at
) VALUES (
    1,
    'SESSION-ADMIN-001',
    DATE_ADD(NOW(), INTERVAL 1 DAY)
);

SET FOREIGN_KEY_CHECKS = 1;
