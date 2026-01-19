/* =========================================================
   NGO DATA HUB - DATABASE SCHEMA
   ========================================================= */

SET FOREIGN_KEY_CHECKS = 0;

/* =========================
   USERS & AUTHENTICATION
   ========================= */

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM(
        'Admin','Coordinator','Member','Volunter',
        'Donor','Finace','Super admin','Staff'
    ) DEFAULT 'Member',
    is_active TINYINT(1) DEFAULT 1,
    last_login DATETIME NULL,
    failed_attempts INT DEFAULT 0,
    lock_until DATETIME NULL,
    last_failed_login DATETIME NULL,
    last_login_ip VARCHAR(100),
    last_login_device VARCHAR(255),
    is_approved TINYINT(1) DEFAULT 0,
    approved_by VARCHAR(100),
    approved_at DATETIME,
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* =========================
   LOGIN LOGS
   ========================= */

CREATE TABLE login_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    email VARCHAR(255),
    ip_address VARCHAR(100),
    device TEXT,
    status ENUM('SUCCESS','FAILED'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

/* =========================
   USER SESSIONS
   ========================= */

CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_id VARCHAR(64) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    device TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    refresh_token TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

/* =========================
   PASSWORD RESET TOKENS
   ========================= */

CREATE TABLE password_reset_token (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    used TINYINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

/* =========================
   STUDENTS
   ========================= */

CREATE TABLE students (
    id VARCHAR(50) PRIMARY KEY,
    student_frf_name VARCHAR(255) NOT NULL,
    student_frf_owner VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    secondary_email VARCHAR(255),
    email_opt_out ENUM('Yes','No') DEFAULT 'No',
    date_of_birth DATETIME,
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    blood_group ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-'),
    parents_contact_number VARCHAR(50) NOT NULL UNIQUE,
    monthly_income DECIMAL(15,2),
    address TEXT,
    permanent_address TEXT,
    class_name ENUM('Class 5','Class 6','Class 7','Class 8','Class 9') NOT NULL,
    section ENUM('A','B','C','D') NOT NULL,
    medium ENUM('English','Hindi','Tamil','Telugu','Malayalam','Other'),
    school VARCHAR(255) NOT NULL,
    created_by VARCHAR(255),
    created_by_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255),
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* =========================
   STUDENT SESSION LOGS
   ========================= */

CREATE TABLE student_session_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    session_date DATETIME,
    course VARCHAR(255) NOT NULL,
    topic_covered TEXT,
    interest_level ENUM('High','Medium','Low'),
    challenges_faced TEXT,
    understanding_level TINYINT,
    overall_score INT,
    remarks TEXT,
    feedback TEXT,
    home_work TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

/* =========================
   VOLUNTEERS
   ========================= */

CREATE TABLE volunteers (
    id VARCHAR(50) PRIMARY KEY,
    volunteer_frf_name VARCHAR(255) NOT NULL,
    volunteer_frf_owner VARCHAR(255) NOT NULL,
    volunteer_id_code VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    secondary_email VARCHAR(255),
    email_opt_out ENUM('Yes','No') DEFAULT 'No',
    gender ENUM('Male','Female','Other'),
    date_of_birth DATE NOT NULL,
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    contact_number VARCHAR(50) NOT NULL UNIQUE,
    emergency_contact_number VARCHAR(50),
    address TEXT,
    blood_group ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-'),
    company_name VARCHAR(255),
    experience TEXT,
    skill ENUM('Teaching','Event Management','Mentoring','Fundraising') NOT NULL,
    id_proof_type VARCHAR(100),
    id_number VARCHAR(100),
    joining_date DATE NOT NULL,
    proof_file_url TEXT,
    created_by VARCHAR(255),
    created_by_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255),
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* =========================
   VOLUNTEER ATTENDANCE
   ========================= */

CREATE TABLE volunteer_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    volunteer_id VARCHAR(50) NOT NULL,
    attendance_date DATE NOT NULL,
    attendance_status ENUM('Present','Absent') NOT NULL,
    performance INT,
    remarks TEXT,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id)
);

/* =========================
   DONORS
   ========================= */

CREATE TABLE donors (
    id VARCHAR(50) PRIMARY KEY,
    donor_frf_name VARCHAR(255) NOT NULL,
    donor_frf_owner VARCHAR(255) NOT NULL,
    donor_id_code VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    secondary_email VARCHAR(255),
    email_opt_out ENUM('Yes','No') DEFAULT 'No',
    donor_type ENUM('Individual','Corporate') NOT NULL,
    contact_person VARCHAR(255),
    contact_number VARCHAR(50) NOT NULL UNIQUE,
    address TEXT,
    created_by VARCHAR(255),
    created_by_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255),
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* =========================
   DONATIONS
   ========================= */

CREATE TABLE donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id VARCHAR(50) NOT NULL,
    donation_date DATE NOT NULL,
    transaction_id VARCHAR(255) NOT NULL UNIQUE,
    purpose VARCHAR(255),
    receipt_number VARCHAR(100),
    receipt_80g_issued ENUM('Yes','No') DEFAULT 'No',
    acknowledgment_sent ENUM('Yes','No') DEFAULT 'No',
    donor_feedback TEXT,
    remarks TEXT,
    amount DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (donor_id) REFERENCES donors(id)
);

/* =========================
   PROJECTS
   ========================= */

CREATE TABLE projects (
    id VARCHAR(50) PRIMARY KEY,
    project_frf_name VARCHAR(255) NOT NULL,
    project_frf_owner VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    secondary_email VARCHAR(255),
    email_opt_out ENUM('Yes','No') DEFAULT 'No',
    project_name VARCHAR(255) NOT NULL,
    project_id_code VARCHAR(100) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE,
    duration VARCHAR(100),
    project_status ENUM('Planning','Ongoing','Completed','On-Hold') NOT NULL,
    objective TEXT,
    budget DECIMAL(15,2),
    budget_utilized DECIMAL(15,2) DEFAULT 0.00,
    impact_summary TEXT,
    location_name VARCHAR(255) NOT NULL,
    target_group VARCHAR(255),
    responsible_officer VARCHAR(255) NOT NULL,
    created_by VARCHAR(255),
    created_by_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255),
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* =========================
   PROJECT ATTENDANCE LOGS
   ========================= */

CREATE TABLE project_attendance_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id VARCHAR(50) NOT NULL,
    log_date DATE NOT NULL,
    attent_list TEXT,
    absent_list TEXT,
    remarks TEXT,
    overall_summary VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

/* =========================
   FINANCE REPORT HEADER
   ========================= */

CREATE TABLE finance_transaction (
    id VARCHAR(50) PRIMARY KEY,
    finance_report_frf_name VARCHAR(255) NOT NULL,
    finance_report_frf_owner VARCHAR(255) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    secondary_email VARCHAR(255),
    email_opt_out ENUM('Yes','No') DEFAULT 'No',
    created_by VARCHAR(255),
    created_by_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255),
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* =========================
   FINANCE TRANSACTIONS
   ========================= */

CREATE TABLE finance_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    finance_report_id VARCHAR(50) NOT NULL,
    transaction_date DATE NOT NULL,
    entity_name VARCHAR(255) NOT NULL,
    income_amount DECIMAL(15,2) DEFAULT 0.00,
    expense_amount DECIMAL(15,2) DEFAULT 0.00,
    bill_transaction_id VARCHAR(255),
    gst_amount DECIMAL(15,2) DEFAULT 0.00,
    remarks TEXT,
    other_details TEXT,
    FOREIGN KEY (finance_report_id) REFERENCES finance_transaction(id)
);

SET FOREIGN_KEY_CHECKS = 1;
