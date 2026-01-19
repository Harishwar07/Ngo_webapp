-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ngo_data_hub;
USE ngo_data_hub;

-- =========================================
-- 0. USER AUTHENTICATION & ACCESS
-- =========================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Store Bcrypt/Argon2 hashes
    role ENUM('Admin', 'Coordinator', 'Member' , 'Volunter' , 'Donor' , 'Finace' , 'Super admin' , 'Staff') DEFAULT 'Member',
    is_active TINYINT(1) DEFAULT 1,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================
-- 1. STUDENTS MODULE
-- =========================================

CREATE TABLE students (
    id VARCHAR(50) PRIMARY KEY, -- Using VARCHAR to support 'stu_1' style IDs
    student_frf_name VARCHAR(255) NOT NULL,
    student_frf_owner VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    secondary_email VARCHAR(255),
    email_opt_out ENUM('Yes', 'No') DEFAULT 'No',
    
    -- Personal Information
    date_of_birth DATE NOT NULL,
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    parents_contact_number VARCHAR(50) NOT NULL,
    monthly_income DECIMAL(15, 2),
    address TEXT,
    permanent_address TEXT,
    
    -- Education
    class_name ENUM('Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9') NOT NULL,
    section ENUM('A', 'B', 'C', 'D') NOT NULL,
    medium ENUM('English', 'Hindi', 'Marathi', 'Urdu'),
    school VARCHAR(255) NOT NULL,
    
    -- Metadata
    created_by VARCHAR(255),
    created_by_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255),
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_student_name (student_frf_name),
    INDEX idx_student_email (email)
);

CREATE TABLE student_session_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    session_date DATE NOT NULL,
    course VARCHAR(255) NOT NULL,
    topic_covered TEXT,
    interest_level ENUM('High', 'Medium', 'Low'),
    challenges_faced TEXT,
    understanding_level TINYINT, -- 1-5
    overall_score INT,
    remarks TEXT,
    feedback TEXT,
    home_work TEXT,
    
    CONSTRAINT fk_student_logs FOREIGN KEY (student_id) 
        REFERENCES students(id) ON DELETE CASCADE
);

-- =========================================
-- 2. VOLUNTEERS MODULE
-- =========================================

CREATE TABLE volunteers (
    id VARCHAR(50) PRIMARY KEY,
    volunteer_frf_name VARCHAR(255) NOT NULL,
    volunteer_frf_owner VARCHAR(255) NOT NULL,
    volunteer_id_code VARCHAR(100) UNIQUE NOT NULL, -- Custom NGO ID
    email VARCHAR(255) NOT NULL,
    secondary_email VARCHAR(255),
    email_opt_out ENUM('Yes', 'No') DEFAULT 'No',
    
    -- Personal Information
    gender ENUM('Male', 'Female', 'Other'),
    date_of_birth DATE NOT NULL,
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    contact_number VARCHAR(50) NOT NULL,
    emergency_contact_number VARCHAR(50),
    address TEXT,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    
    -- Work Info
    company_name VARCHAR(255),
    experience TEXT,
    skill ENUM('Teaching', 'Event Management', 'Mentoring', 'Fundraising') NOT NULL,
    
    -- Proof Details
    id_proof_type VARCHAR(100),
    id_number VARCHAR(100),
    joining_date DATE NOT NULL,
    proof_file_url TEXT,
    
    -- Metadata
    created_by VARCHAR(255),
    created_by_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255),
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_vol_name (volunteer_frf_name),
    INDEX idx_vol_code (volunteer_id_code)
);

CREATE TABLE volunteer_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    volunteer_id VARCHAR(50) NOT NULL,
    attendance_date DATE NOT NULL,
    attendance_status ENUM('Present', 'Absent') NOT NULL,
    performance DECIMAL(15, 2),
    remarks TEXT,
    
    CONSTRAINT fk_vol_attendance FOREIGN KEY (volunteer_id) 
        REFERENCES volunteers(id) ON DELETE CASCADE
);

-- =========================================
-- 3. DONORS MODULE
-- =========================================

CREATE TABLE donors (
    id VARCHAR(50) PRIMARY KEY,
    donor_frf_name VARCHAR(255) NOT NULL,
    donor_frf_owner VARCHAR(255) NOT NULL,
    donor_id_code VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    secondary_email VARCHAR(255),
    email_opt_out ENUM('Yes', 'No') DEFAULT 'No',
    
    -- Details
    donor_type ENUM('Individual', 'Corporate') NOT NULL,
    contact_person VARCHAR(255), -- For Corporate
    contact_number VARCHAR(50) NOT NULL,
    address TEXT,
    
    -- Metadata
    created_by VARCHAR(255),
    created_by_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255),
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_donor_name (donor_frf_name)
);

CREATE TABLE donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id VARCHAR(50) NOT NULL,
    donation_date DATE NOT NULL,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    purpose VARCHAR(255),
    receipt_number VARCHAR(100),
    receipt_80g_issued ENUM('Yes', 'No') DEFAULT 'No',
    acknowledgment_sent ENUM('Yes', 'No') DEFAULT 'No',
    donor_feedback TEXT,
    remarks TEXT,
    amount DECIMAL(15, 2) NOT NULL,
    
    CONSTRAINT fk_donations FOREIGN KEY (donor_id) 
        REFERENCES donors(id) ON DELETE CASCADE
);

-- =========================================
-- 4. BOARD OF TRUSTEES MODULE
-- =========================================

CREATE TABLE board_members (
    id VARCHAR(50) PRIMARY KEY,
    board_frf_name VARCHAR(255) NOT NULL,
    board_frf_owner VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    secondary_email VARCHAR(255),
    email_opt_out ENUM('Yes', 'No') DEFAULT 'No',
    
    -- Personal Info
    gender ENUM('Male', 'Female', 'Other'),
    date_of_birth DATE NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    emergency_contact_number VARCHAR(50),
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    address TEXT,
    
    -- Proof Details
    id_proof_type VARCHAR(100),
    id_number VARCHAR(100),
    joining_date DATE NOT NULL,
    proof_file_url TEXT,
    
    -- Role
    designation ENUM('Chairperson', 'Treasurer', 'Secretary', 'Member') NOT NULL,
    role_description TEXT,
    
    -- Metadata
    created_by VARCHAR(255),
    created_by_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255),
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================
-- 5. PROJECTS MODULE
-- =========================================

CREATE TABLE projects (
    id VARCHAR(50) PRIMARY KEY,
    project_frf_name VARCHAR(255) NOT NULL,
    project_frf_owner VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    secondary_email VARCHAR(255),
    email_opt_out ENUM('Yes', 'No') DEFAULT 'No',
    
    -- Details
    project_name VARCHAR(255) NOT NULL,
    project_id_code VARCHAR(100) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    duration VARCHAR(100),
    project_status ENUM('Planning', 'Ongoing', 'Completed', 'On-Hold') NOT NULL,
    objective TEXT,
    budget DECIMAL(15, 2),
    budget_utilized DECIMAL(15, 2) DEFAULT 0.00,
    impact_summary TEXT,
    location_name VARCHAR(255) NOT NULL,
    target_group VARCHAR(255),
    responsible_officer VARCHAR(255) NOT NULL,
    
    -- Metadata
    created_by VARCHAR(255),
    created_by_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255),
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_project_name (project_name)
);

CREATE TABLE project_attendance_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id VARCHAR(50) NOT NULL,
    log_date DATE NOT NULL,
    attent_list TEXT, -- Serialized list or description of attendees
    absent_list TEXT,
    overall_summary TEXT,
    remarks TEXT,
    
    CONSTRAINT fk_project_logs FOREIGN KEY (project_id) 
        REFERENCES projects(id) ON DELETE CASCADE
);

-- =========================================
-- 6. FINANCE REPORTS MODULE
-- =========================================

CREATE TABLE finance_reports (
    id VARCHAR(50) PRIMARY KEY,
    finance_report_frf_name VARCHAR(255) NOT NULL,
    finance_report_frf_owner VARCHAR(255) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    secondary_email VARCHAR(255),
    email_opt_out ENUM('Yes', 'No') DEFAULT 'No',
    
    -- Metadata
    created_by VARCHAR(255),
    created_by_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255),
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_finance_report_name (finance_report_frf_name)
);

CREATE TABLE finance_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    finance_report_id VARCHAR(50) NOT NULL,
    transaction_date DATE NOT NULL,
    entity_name VARCHAR(255) NOT NULL, -- Who was paid or who paid
    income_amount DECIMAL(15, 2) DEFAULT 0.00,
    expense_amount DECIMAL(15, 2) DEFAULT 0.00,
    bill_transaction_id VARCHAR(255),
    gst_amount DECIMAL(15, 2) DEFAULT 0.00,
    remarks TEXT,
    other_details TEXT,
    
    CONSTRAINT fk_finance_txns FOREIGN KEY (finance_report_id) 
        REFERENCES finance_reports(id) ON DELETE CASCADE
);

-- =========================================
-- SEED DATA: INITIAL ADMIN USER
-- =========================================
-- Password is 'admin123' (You should hash this in your real logic)
INSERT INTO users (full_name, email, password_hash, role) 
VALUES ('Admin1', 'admin1@ngo.org', 'admin123', 'Admin');