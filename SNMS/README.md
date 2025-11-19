# Steps Nursery Management System (SNMS)

An all-in-one digital platform designed to manage all academic, administrative, operational, HR, and financial processes inside Steps Play School.

## Tech Stack

### Backend
- **Laravel 11** - REST API
- **Laravel Sanctum** - Authentication
- **MySQL 8** - Database
- **PHP 8.2+** - Server-side language

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## Project Structure

```
SNMS/
├── backend/          # Laravel backend API
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── routes/
│   └── ...
├── frontend/         # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
└── prd.md           # Product Requirements Document
```

## Setup Instructions

### Prerequisites

- PHP 8.2 or higher
- Composer
- MySQL 8
- Node.js 18+ & npm

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   composer install
   ```

3. Copy environment file (if not already present):
   ```bash
   cp .env.example .env
   ```

4. Generate application key:
   ```bash
   php artisan key:generate
   ```

5. Configure your database in `.env` file

6. Run migrations:
   ```bash
   php artisan migrate
   ```

7. Start the development server:
   ```bash
   php artisan serve --host=127.0.0.1 --port=8000
   ```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp src/.env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend application will be available at `http://localhost:3000`

### Running Both

To run the full application, you need to start both servers:

**Terminal 1 (Backend):**
```bash
cd backend
php artisan serve --host=127.0.0.1 --port=8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Then access the application at `http://localhost:3000`

## Features

- Student Management
- Online Admission
- Attendance Management
- Evaluation & Progress Reports
- Events & Journeys (Trips)
- HR & Payroll
- Accounting & Finance
- Inventory & Assets
- Parent App

## Documentation

For full product requirements, see [prd.md](prd.md)

## License

MIT
