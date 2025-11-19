1. Overview

Steps Nursery Management System (SNMS) is an all-in-one digital platform designed to manage all academic, administrative, operational, HR, and financial processes inside Steps Play School.
This PRD defines the complete functional, technical, and architectural requirements for the system.

⸻

2. System Goals
   • Centralize all workflows into a single platform
   • Improve communication between nursery and parents
   • Automate attendance, evaluation, payroll, accounting
   • Provide real-time dashboards and reporting
   • Ensure security and role-based access
   • Support multiple nursery branches in the future

⸻

3. User Roles
   Role
   Description
   Super Admin
   System owner with full access
   Admin
   Manages daily operations
   Teacher
   Handles class activities, attendance, evaluation
   Reception
   Admissions, parent communication
   HR Officer
   Employee records, leaves, payroll resources
   Accountant
   Invoices, expenses, financial reports
   Parent
   Child dashboard, reports, events, payments

4. Modules Overview

4.1 Student Management
• Student profiles with documents
• Class assignment
• Medical and emergency info
• Enrollment status (active, graduated, waiting, withdrawn)

4.2 Online Admission
• Digital admission form
• Document upload
• Interview / assessment scheduling
• Application pipeline (New → In Review → Accepted → Rejected)

4.3 Attendance Management
• Student attendance (manual / QR)
• Teacher attendance
• Absence notifications
• Monthly reports

4.4 Evaluation & Progress Reports
• Monthly or weekly evaluations
• Skills-based assessment
• Photo / video attachments
• Parent-facing progress reports

4.5 Events & Journeys (Trips)
• Event creation
• Parental permission
• Online fee payment
• Attendance tracking

4.6 HR & Payroll
• Employee records
• Leaves and attendance
• Payroll calculation
• Payslips generation

4.7 Accounting & Finance
• Tuition invoices
• Online payment support
• Expenses tracking
• Cashflow & P&L reports

4.8 Inventory & Assets
• Stock management (uniform, stationery, kitchen supplies)
• Low-stock alerts
• Asset lifecycle and condition tracking

4.9 Parent App
• Child daily report
• Attendance timeline
• Photo & media updates
• Messages & notices
• Events & payments
• Profile settings

5. Technical Architecture
   Frontend:

- React (Admin Web)
- React / Mobile-first UI (Parent App)

Backend:

- Laravel 12 REST API
- Laravel Sanctum Authentication

Database:

- MySQL 8

Storage:

- Cloud Object Storage (S3 or DigitalOcean Spaces)

Integrations:

- WhatsApp API (notifications)
- Email (SMTP)
- Payment Gateway (Paymob / Stripe)

Deployment:

- Nginx + PHP-FPM
- Docker (optional)
- CI/CD pipeline recommended

6. API Structure (High-Level)
   • Authentication: - POST /api/login - POST /api/logout - GET /api/user
   • Students:

   - GET /api/students
   - POST /api/students
   - PUT /api/students/{id}
   - DELETE /api/students/{id}
     • Evaluations:
     POST /api/evaluations
     GET /api/evaluations/{student_id}
     • Accounting
     GET /api/invoices
     POST /api/invoices
     PUT /api/invoices/{id}
     • HR & Payroll
     GET /api/employees
     POST /api/payroll
     GET /api/payroll/{employee_id}
     • Inventory, Assets, Admissions
     (Similar CRUD endpoints)

7. Database Schema (Summary)
   Table: students:
   id, student_code, first_name, last_name,
   dob, gender, class_id, guardian_id,
   medical_notes, status
   Table: guardians:
   id, name, phone, email, address
   Table: teachers:
   id, name, email, phone, specialization, salary
   Table: classes:
   id, name, email, phone, specialization, salary
   Table: student_attendance:
   id, student_id, date, status, notes
   Table: evaluations:
   id, student_id, subject_id, skill, grade, notes, attachment
   Table: employees:
   id, name, role, email, salary, contract_start, contract_end
   Table: payroll:
   id, employee_id, month, base_salary,
   overtime, deductions, net_salary
   Table: invoices:
   id, student_id, type, amount, status, due_date
   Table: expenses:
   id, category, amount, date, description
   Table: stock_items:
   id, name, category, quantity, min_quantity, supplier_id
   Table: assets:
   id, name, category, purchase_date, condition, value, location

8. User Stories (Examples)

Admission

As a parent, I want to apply online so I can enroll my child easily.

Attendance

As a teacher, I want to mark daily attendance quickly so I can focus on teaching.

Evaluation

As an admin, I want all evaluations stored digitally so I can track progress.

Payroll

As HR, I want payroll generated automatically so I can avoid manual errors.

⸻

9. Non-Functional Requirements
   • Response time <250ms
   • 99.9% uptime
   • Secure password hashing (bcrypt)
   • Role-based access control
   • Optimized database indexing
   • S3-based scalable storage
   • HTTPS encryption
   • API rate limiting
   • API key authentication
   • API versioning
   • API documentation
   • API testing
   • API monitoring
   • API logging
   • API error handling
   • API security
   • API performance
   • API reliability
   • API scalability
   • API maintainability
   • API usability
   • API portability
   • API compatibility
   • API interoperability
   • API extensibility
