# SNMS Frontend

React + Vite + TypeScript frontend for Steps Nursery Management System.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your API URL (default is `http://localhost:8000/api`)

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript types
│   ├── App.tsx         # Root component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Public assets
└── index.html          # HTML template
```

## Features

- **Dashboard** - Overview of key metrics
- **Student Management** - Manage student profiles
- **Teacher Management** - Manage teacher profiles
- **Attendance** - Track attendance
- **Authentication** - Login/logout functionality

## API Integration

The frontend connects to the Laravel backend API. The API base URL is configured in `.env`:

```
VITE_API_URL=http://localhost:8000/api
```

All API calls are made through the `src/services/api.ts` service, which includes:
- Automatic authentication token injection
- Response/error interceptors
- Base URL configuration
