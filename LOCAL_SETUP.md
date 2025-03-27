# SoftFlow Technologies - Local Setup Guide

This guide will help you set up and run the SoftFlow Technologies website on your local machine.

## Prerequisites

- Node.js (version 16 or later)
- PostgreSQL (version 12 or later)
- Git (optional)

## Step 1: Get the Code

You can clone the repository or download it as a ZIP archive.

```bash
git clone https://github.com/manish-87/Soft-Flow-Tecnologies.git
cd Soft-Flow-Tecnologies
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Database Setup

### 3.1 Create a PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database (in the PostgreSQL terminal)
CREATE DATABASE softflowtech;

# Exit the PostgreSQL terminal
\q
```

### 3.2 Configure Environment Variables

Create a `.env` file in the root directory with the following content:

```
# Database connection
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/softflowtech

# Session secret for auth
SESSION_SECRET=H9L5x7ZdRfqTvJmP3bKwG2cE8nYsVu6X
```

Replace `your_password` with your actual PostgreSQL password.

## Step 4: Initialize the Database

```bash
npm run db:push
```

This will create all the necessary tables in your database.

## Step 5: Start the Application

```bash
npm run dev
```

The application should now be running at [http://localhost:5000](http://localhost:5000)

## Admin Access

For admin access, use these credentials:
- Username: `admin`
- Password: `JMk@475869`

## Database Schema Overview

The application uses the following tables:

- **users**: For user management and authentication
- **blogs**: For blog posts
- **partners**: For partner companies
- **services**: For services offered
- **careers**: For job postings
- **applications**: For tracking job applications
- **messages**: For contact form submissions
- **projects**: For user projects

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Make sure PostgreSQL is running
2. Verify your credentials in the `.env` file
3. Check that the database exists

```bash
psql -U postgres -c "SELECT datname FROM pg_database WHERE datname='softflowtech';"
```

### Port Conflict

If port 5000 is already in use, you can modify the port in `server/index.ts`:

```javascript
const port = 3000; // Change to another port
```

### Windows-Specific Issues

If you encounter this error on Windows:
```
Error: listen ENOTSUP: operation not supported on socket 0.0.0.0:5000
```

The fix has already been applied in this guide by modifying the server.listen() configuration in server/index.ts.

## Application Features

- **Authentication**: User registration, login, and profile management
- **Admin Dashboard**: Manage users, blog posts, careers, services, and partners
- **Public Pages**: Home, Services, About, Blog, Careers
- **User Dashboard**: Track project status and more

## Development Guidelines

- React components are in the `client/src/components` directory
- API routes are defined in `server/routes.ts`
- Database models are defined in `shared/schema.ts`

For more information, refer to the main README.md file.