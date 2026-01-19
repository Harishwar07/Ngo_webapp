NGO Data Hub – Web Application

📌 Overview

NGO Data Hub is a centralized web application designed to manage NGO operations efficiently.
It allows administrators to manage:

👩‍🎓 Students (with session logs)

🤝 Volunteers (with attendance & performance)

💰 Donors (with donation history)

📁 Projects (with attendance logs)

📊 Finance Reports (with transactions)

🏛 Board Members

The system supports dynamic sub-forms, secure authentication, and role-based access.

---------------------------------------------------------------------------------------

🧱 Tech Stack
Frontend

React + TypeScript

Vite

Tailwind CSS

Backend

Node.js

Express.js

MySQL

JWT Authentication

CSRF Protection

Multer (file uploads)

Database

MySQL (relational, normalized)

Separate tables for sub-forms

---------------------------------------------------------------------------------------


📁 Project Structure

ngo-data-hub/

├── frontend/          # React frontend


├── backend/           # Node.js backend


├── database/          # SQL schema & seed files


├── .gitignore


└── README.md


---------------------------------------------------------------------------------------

⚙️ Prerequisites (Before You Start)

Make sure the following are installed:

Node.js (v18 or above)
https://nodejs.org

MySQL Server
https://dev.mysql.com/downloads/

Git
https://git-scm.com/

Verify installation:

node -v
npm -v
mysql --version
git --version

---------------------------------------------------------------------------------------

🗄️ Database Setup (FROM SCRATCH)

1️⃣ Create Database

Open MySQL and run:

CREATE DATABASE ngo_data_hub;

2️⃣ Import Schema

From the project root:

mysql -u root -p ngo_data_hub < backend/schema.sql


(Optional)

mysql -u root -p ngo_data_hub < backend/seed.sql

---------------------------------------------------------------------------------------

🔐 Environment Variables
Backend

Create file:

backend/.env


Example:

PORT=3001

DB_HOST=localhost

DB_USER=root

DB_PASSWORD=your_mysql_password

DB_NAME=ngo_data_hub

JWT_SECRET=super_secret_key

ACCESS_TOKEN_SECRET=ACCESS_TOKEN_SECRET_key

REFRESH_TOKEN_SECRET= Another_ACCESS_TOKEN_SECRET_key


---------------------------------------------------------------------------------------

🚀 Backend Setup
cd backend
npm install
npm run dev


If successful:

Backend running on https://localhost:3001

---------------------------------------------------------------------------------------

🌐 Frontend Setup
cd frontend
npm install
npm run dev


If successful:

Frontend running on http://localhost:5173

---------------------------------------------------------------------------------------

🔑 Login

Use provided credentials (or seeded admin user):

Email: admin@example.com
Password: Admin@123

Passwords are securely hashed using bcrypt.
