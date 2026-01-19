
import type { AnyRecord, FrfEntity, Student, Volunteer, Donor, BoardMember, Project, FinanceReport } from '../types';

// In-memory database for mock data, initialized empty.
const mock_database: Record<FrfEntity['id'], AnyRecord[]> = {
    students: [],
    volunteers: [],
    donors: [],
    board_members: [],
    projects: [],
    finance_reports: [],
};

// --- Helper to generate a unique ID ---
const generate_id = () => `id_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper for creating past dates
const past_date = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
};

// --- Data Initialization ---

const initialize_mock_database = () => {
    // Prevent re-initialization
    if (mock_database.students.length > 0) return;

    // --- STUDENTS DATA ---
    const mock_students: Student[] = [
        {
            id: 'stu_1', student_frf_name: 'Aarav Sharma', student_frf_owner: 'Priya Singh', email: 'aarav.sharma@example.com', email_opt_out: 'No', created_by: 'Admin User', created_by_date: past_date(120), modified_by: 'Admin User', modified_date: past_date(5),
            date_of_birth: '2012-05-15', father_name: 'Ramesh Sharma', blood_group: 'O+', mother_name: 'Sunita Sharma', parents_contact_number: '9876543210', address: '123 School Lane, Mumbai, MH', monthly_income: 25000, permanent_address: '123 School Lane, Mumbai, MH',
            class_name: 'Class 7', section: 'A', medium: 'English', school: 'City International School',
            session_logs: [
                { date: past_date(10), course: 'Mathematics', topic_covered: 'Algebra', interest_level: 'High', challenges_faced: 'None', understanding_level: 5, overall_score: 95, remarks: 'Excellent', feedback: 'Keep it up', home_work: 'Chapter 3' },
                { date: past_date(3), course: 'Science', topic_covered: 'Photosynthesis', interest_level: 'Medium', challenges_faced: 'Diagrams', understanding_level: 4, overall_score: 88, remarks: 'Good', feedback: 'Practice drawing', home_work: 'Chapter 5' }
            ]
        },
        {
            id: 'stu_2', student_frf_name: 'Priya Patel', student_frf_owner: 'Priya Singh', email: 'priya.patel@example.com', email_opt_out: 'No', created_by: 'Admin User', created_by_date: past_date(90), modified_by: 'Admin User', modified_date: past_date(12),
            date_of_birth: '2014-02-20', father_name: 'Suresh Patel', blood_group: 'A+', mother_name: 'Meena Patel', parents_contact_number: '9821098765', address: '456 Lake View, Bhopal, MP', monthly_income: 18000, permanent_address: '456 Lake View, Bhopal, MP',
            class_name: 'Class 5', section: 'B', medium: 'Hindi', school: 'Government Model School',
            session_logs: [
                { date: past_date(8), course: 'Hindi', topic_covered: 'Grammar', interest_level: 'High', challenges_faced: 'None', understanding_level: 5, overall_score: 92, remarks: 'Very attentive', feedback: 'Excellent work', home_work: 'Essay writing' }
            ]
        },
        {
            id: 'stu_3', student_frf_name: 'Sameer Khan', student_frf_owner: 'Amit Jain', email: 'sameer.khan@example.com', email_opt_out: 'Yes', created_by: 'Admin User', created_by_date: past_date(150), modified_by: 'Admin User', modified_date: past_date(25),
            date_of_birth: '2010-11-30', father_name: 'Imran Khan', blood_group: 'B+', mother_name: 'Fatima Khan', parents_contact_number: '9988776655', address: '789 Royal Gardens, Delhi', monthly_income: 45000, permanent_address: '789 Royal Gardens, Delhi',
            class_name: 'Class 9', section: 'C', medium: 'English', school: 'Delhi Public School',
            session_logs: [
                { date: past_date(15), course: 'Physics', topic_covered: 'Laws of Motion', interest_level: 'Medium', challenges_faced: 'Numerical problems', understanding_level: 3, overall_score: 75, remarks: 'Needs practice', feedback: 'Focus on application', home_work: 'Solve problem set' }
            ]
        }
    ];

    // --- VOLUNTEERS DATA ---
    const mock_volunteers: Volunteer[] = [
        {
            id: 'vol_1', volunteer_frf_name: 'Rohan Gupta', volunteer_frf_owner: 'Coordinator', volunteer_id_code: 'VOL-001', email: 'rohan.gupta@example.com', email_opt_out: 'No', created_by: 'Admin User', created_by_date: past_date(200), modified_by: 'Admin User', modified_date: past_date(10),
            gender: 'Male', date_of_birth: '1995-11-20', father_name: 'Anil Gupta', mother_name: 'Rekha Gupta', contact_number: '9123456780', emergency_contact_number: '9123456781', address: '789 Tech Park, Bengaluru, KA', blood_group: 'B+',
            company_name: 'Tech Solutions Inc.', experience: '5 years in software development', skill: 'Teaching', id_proof_type: 'Aadhar Card', id_number: '1234 5678 9012', joining_date: '2023-01-10', proof_file_upload: '#',
            attendance: [
                { date: past_date(7), attendance: 'Present', performance: 5, remarks: 'Good session.' },
                { date: past_date(14), attendance: 'Present', performance: 4, remarks: 'Helped organize the event.' },
            ]
        },
        {
            id: 'vol_2', volunteer_frf_name: 'Anika Desai', volunteer_frf_owner: 'Coordinator', volunteer_id_code: 'VOL-002', email: 'anika.desai@example.com', email_opt_out: 'No', created_by: 'Admin User', created_by_date: past_date(180), modified_by: 'Admin User', modified_date: past_date(20),
            gender: 'Female', date_of_birth: '1998-03-12', father_name: 'Mahesh Desai', mother_name: 'Jaya Desai', contact_number: '9876501234', emergency_contact_number: '9876501235', address: '321 Art Street, Pune, MH', blood_group: 'AB+',
            company_name: 'Creative Minds', experience: '3 years in graphic design', skill: 'Event Management', id_proof_type: 'Passport', id_number: 'M1234567', joining_date: '2023-03-15', proof_file_upload: '#',
            attendance: [
                { date: past_date(10), attendance: 'Present', performance: 5, remarks: 'Designed event banners.' }
            ]
        }
    ];

    // --- DONORS DATA ---
    const mock_donors: Donor[] = [
        {
            id: 'don_1', donor_frf_name: 'Rajesh Singh', donor_frf_owner: 'Fundraising Team', donor_id_code: 'DON-IND-001', email: 'rajesh.singh@example.com', email_opt_out: 'No', created_by: 'Admin User', created_by_date: past_date(80), modified_by: 'Admin User', modified_date: past_date(30),
            donor_type: 'Individual', contact_number: '9998887770', address: '555 Wealth Avenue, Gurgaon, HR',
            donations: [
                { date: past_date(30), transaction_id: 'TXN12345', purpose: 'Mid-day Meal Program', receipt_number: 'REC-001', '80G_receipt_issued': 'Yes', acknowledgment_sent: 'Yes', donor_feedback: 'Happy to contribute.', remarks: '', amount: 5000 }
            ]
        },
        {
            id: 'don_2', donor_frf_name: 'Future Foundation', donor_frf_owner: 'Fundraising Team', donor_id_code: 'DON-CORP-001', email: 'contact@futurefoundation.org', email_opt_out: 'No', created_by: 'Admin User', created_by_date: past_date(250), modified_by: 'Admin User', modified_date: past_date(45),
            donor_type: 'Corporate', contact_person: 'Sunita Agarwal', contact_number: '022-23456789', address: 'Global Business Park, Mumbai, MH',
            donations: [
                { date: past_date(100), transaction_id: 'TXN67890', purpose: 'Digital Literacy Project', receipt_number: 'REC-002', '80G_receipt_issued': 'Yes', acknowledgment_sent: 'Yes', donor_feedback: 'Pleased with the project progress.', remarks: 'Annual donation', amount: 250000 },
                { date: past_date(45), transaction_id: 'TXN101112', purpose: 'Scholarship Fund', receipt_number: 'REC-008', '80G_receipt_issued': 'No', acknowledgment_sent: 'Yes', donor_feedback: '', remarks: '', amount: 150000 }
            ]
        }
    ];

    // --- BOARD MEMBERS DATA ---
    const mock_board: BoardMember[] = [
        { 
            id: 'brd_1', 
            board_frf_name: 'Dr. Vikram Singh', 
            board_frf_owner: 'System Admin',
            email: 'vikram.singh@example.com', 
            email_opt_out: 'No', 
            created_by: 'System',
            created_by_date: past_date(1000), 
            modified_by: 'System', 
            modified_date: past_date(100),
            
            // Personal Info
            gender: 'Male',
            date_of_birth: '1965-04-10',
            contact_number: '9123456789',
            emergency_contact_number: '9123456788',
            blood_group: 'O+',
            father_name: 'Rajendra Singh',
            mother_name: 'Lata Singh',
            address: '101 Chairman Ave, New Delhi',
            
            // Proof Details
            id_proof_type: 'Passport',
            id_number: 'K1234567',
            joining_date: '2020-01-01',
            proof_file_upload: '#',

            // Role
            designation: 'Chairperson',
            role_description: 'A retired professor with 30 years of experience in social work and education. Passionate about child welfare.',
            tenure_end: undefined,
        },
        { 
            id: 'brd_2', 
            board_frf_name: 'Aisha Begum', 
            board_frf_owner: 'System Admin',
            email: 'aisha.begum@example.com', 
            email_opt_out: 'No', 
            created_by: 'System',
            created_by_date: past_date(800), 
            modified_by: 'System', 
            modified_date: past_date(50),

            // Personal Info
            gender: 'Female',
            date_of_birth: '1978-09-22',
            contact_number: '9234567890',
            emergency_contact_number: '9234567891',
            blood_group: 'A-',
            father_name: 'Yusuf Begum',
            mother_name: 'Zarina Begum',
            address: '202 Finance Towers, Mumbai, MH',
            
            // Proof Details
            id_proof_type: 'Aadhar Card',
            id_number: '9876 5432 1098',
            joining_date: '2021-06-01',
            proof_file_upload: '#',
            
            // Role
            designation: 'Treasurer',
            role_description: 'Chartered Accountant with a focus on non-profit financial management.',
        }
    ];

    // --- PROJECTS DATA ---
    const mock_projects: Project[] = [
        {
            id: 'proj_1', project_frf_name: 'Project Shiksha', project_frf_owner: 'Project Manager', project_name: 'Project Shiksha', project_id_code: 'PROJ-EDU-01', email: 'shiksha@example.com', email_opt_out: 'No', created_by: 'Admin User', created_by_date: past_date(400), modified_by: 'P. Manager', modified_date: past_date(15),
            status: 'Ongoing', start_date: '2023-04-01', duration: '24 months', objective: 'To provide quality education to underprivileged children.', budget: 500000, budget_utilized: 125000, impact_summary: 'Enrolled 150 new students.', location_name: 'Rural Maharashtra', target_group: 'Children aged 6-14', responsible_officer: 'Meena Kumari',
            attendance_logs: [
                { date: past_date(20), attent_list: '145 students, 10 volunteers', absent_list: '5 students', overall_summary: 'Successful community engagement event.', remarks: '' }
            ]
        },
        {
            id: 'proj_2', project_frf_name: 'Clean Water Initiative', project_frf_owner: 'Project Manager', project_name: 'Clean Water Initiative', project_id_code: 'PROJ-HLT-01', email: 'water@example.com', email_opt_out: 'No', created_by: 'Admin User', created_by_date: past_date(600), modified_by: 'P. Manager', modified_date: past_date(90),
            status: 'Completed', start_date: '2022-01-15', end_date: '2023-12-31', duration: '24 months', objective: 'Install 50 water purification units in remote villages.', budget: 1200000, budget_utilized: 1150000, impact_summary: 'Provided clean drinking water to over 5000 families.', location_name: 'Sundarbans, WB', target_group: 'All villagers', responsible_officer: 'Arjun Das',
            attendance_logs: []
        }
    ];

    // --- FINANCE REPORTS DATA ---
    const mock_finance: FinanceReport[] = [
        {
            id: 'fin_1', finance_report_frf_name: 'Q1 2024 Expenses - Project Shiksha', finance_report_frf_owner: 'Finance Department', project_name: 'Project Shiksha', email: 'finance@example.com', email_opt_out: 'No', created_by: 'Admin User', created_by_date: past_date(90), modified_by: 'F. Manager', modified_date: past_date(25),
            transactions: [
                { date: past_date(80), name: 'Stationery Purchase', income_amount: 0, expense_amount: 15000, bill_transaction_id: 'BILL-456', gst: 18, remarks: 'For student kits', other_details: '' },
                { date: past_date(75), name: 'Volunteer Transportation', income_amount: 0, expense_amount: 5000, bill_transaction_id: 'BILL-457', gst: 5, remarks: 'Monthly travel allowance', other_details: '' },
                 { date: past_date(70), name: 'Grant from Future Foundation', income_amount: 150000, expense_amount: 0, bill_transaction_id: 'TXN101112', gst: 0, remarks: 'Scholarship fund', other_details: '' }
            ]
        },
        {
            id: 'fin_2', finance_report_frf_name: 'Annual Donations Report 2023', finance_report_frf_owner: 'Finance Department', project_name: 'General Fund', email: 'finance@example.com', email_opt_out: 'No', created_by: 'Admin User', created_by_date: past_date(150), modified_by: 'F. Manager', modified_date: past_date(120),
            transactions: [
                { date: past_date(200), name: 'Donation from Rajesh Singh', income_amount: 5000, expense_amount: 0, bill_transaction_id: 'TXN12345', gst: 0, remarks: '', other_details: '' },
                { date: past_date(250), name: 'Corporate Donation - Future Foundation', income_amount: 250000, expense_amount: 0, bill_transaction_id: 'TXN67890', gst: 0, remarks: '', other_details: '' }
            ]
        }
    ];

    // Populate the main database object
    mock_database.students = mock_students;
    mock_database.volunteers = mock_volunteers;
    mock_database.donors = mock_donors;
    mock_database.board_members = mock_board;
    mock_database.projects = mock_projects;
    mock_database.finance_reports = mock_finance;

    console.log('[MOCK DATA] In-memory database has been initialized.');
};


// --- Service Functions ---

export const get_mock_list = (entity_id: FrfEntity['id']): AnyRecord[] => {
    const records = mock_database[entity_id] || [];
    if (entity_id === 'students') {
        return records.map(record => {
            const student = record as Student;
            const avg_score = student.session_logs.length > 0 
                ? student.session_logs.reduce((acc, p) => acc + p.overall_score, 0) / student.session_logs.length 
                : 0;
            return { ...student, avg_overall_score: avg_score };
        });
    }
    return records;
};

export const get_mock_detail = (entity_id: FrfEntity['id'], record_id: string): AnyRecord | null => {
    const records = mock_database[entity_id];
    return records?.find(rec => rec.id === record_id) || null;
};

export const add_mock_record = (entity_id: FrfEntity['id'], record_data: Partial<AnyRecord>): AnyRecord => {
    const records = mock_database[entity_id];
    if (!records) {
        throw new Error(`Invalid entity ID: ${entity_id}`);
    }

    const new_record: AnyRecord = {
        created_by: 'Current User', // Default
        created_by_date: new Date().toISOString(),
        modified_by: 'Current User',
        modified_date: new Date().toISOString(),
        email_opt_out: 'No', // Default value
        ...record_data, // Spread last to override defaults if values are provided in form
        id: generate_id(), // ID is always system generated
    } as AnyRecord; // Type assertion needed here because we are building it dynamically

    // Initialize empty sub-forms to prevent runtime errors on detail view
    switch (entity_id) {
        case 'students': (new_record as Student).session_logs = []; break;
        case 'volunteers': (new_record as Volunteer).attendance = []; break;
        case 'donors': (new_record as Donor).donations = []; break;
        case 'projects': (new_record as Project).attendance_logs = []; break;
        case 'finance_reports': (new_record as FinanceReport).transactions = []; break;
        // board members don't have a sub-form
    }

    records.push(new_record);
    console.log(`[MOCK DATA] Added new record to ${entity_id}:`, new_record);
    return new_record;
};

// Initialize the data on script load
initialize_mock_database();

export const update_mock_record = (entity_id: FrfEntity['id'], record_id: string, record_data: Partial<AnyRecord>): AnyRecord => {
    const records = mock_database[entity_id];
    const index = records.findIndex(r => r.id === record_id);
    if (index === -1) throw new Error('Record not found');
    const updated_record = {
        ...records[index],
        ...record_data,
        id: record_id, // Ensure ID stays same
        modified_by: 'Current User',
        modified_date: new Date().toISOString()
    } as AnyRecord;
    records[index] = updated_record;
    return updated_record;
};

export const delete_mock_record = (entity_id: FrfEntity['id'], record_id: string): void => {
    mock_database[entity_id] = mock_database[entity_id].filter(r => r.id !== record_id);
};

