# Have a Look at the website
https://softflow-tech-solutions.onrender.com/
# SoftFlow Corporate Website

A professional corporate website for SoftFlow that provides comprehensive service showcasing, robust user management, and an intuitive admin panel with enhanced user experience features.

## Features

- Responsive design built with React and Tailwind CSS
- Complete authentication system with user verification
- Admin panel for managing users, blog posts, services, and more
- User dashboard to track project status and applications
- Service showcase with customizable icons and descriptions
- Career portal with application submission functionality
- Blog system for publishing articles
- Contact form for user inquiries
- Comprehensive finance and billing system with invoices and payments
- Project management with status tracking
- Multiple payment status indicators (paid/unpaid/pending/partially paid)
- Stripe integration for payment processing

## Tech Stack

- **Frontend**: React, Tailwind CSS, Shadcn UI Components, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with custom verification
- **State Management**: React Query
- **Payment Processing**: Stripe

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL database

### Local Installation and Setup

1. Clone the repository or [download the ZIP file](https://github.com/manish-87/Soft-Flow-Tecnologies/archive/refs/heads/main.zip)
   ```bash
   git clone https://github.com/manish-87/Soft-Flow-Tecnologies.git
   cd Soft-Flow-Tecnologies
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up the PostgreSQL database
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create the database
   CREATE DATABASE softflowtech;
   
   # Exit PostgreSQL
   \q
   ```

4. Set up environment variables
   Edit the `.env` file in the root directory:
   ```
   # Uncomment and modify this line with your database credentials
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/softflowtech
   
   # Session secret for authentication (already set)
   SESSION_SECRET=H9L5x7ZdRfqTvJmP3bKwG2cE8nYsVu6X
   
   # If using Stripe payments, add these (optional)
   # STRIPE_SECRET_KEY=your_stripe_secret_key
   # VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

5. Initialize the database schema
   ```bash
   npm run db:push
   ```

6. Start the development server
   ```bash
   npm run dev
   ```

7. Access the application at http://localhost:5000

### Default Admin Credentials

The system comes with a pre-configured admin account:
- Username: admin
- Password: JMk@475869

You can use these credentials to access the admin dashboard and manage the system.

## Deployment to Render

This project includes a `render.yaml` configuration file for easy deployment to Render.

### Deploy with one click

1. Fork or clone this repository to your GitHub account
2. Create a Render account at https://render.com
3. Click "New" and select "Blueprint" from the Render dashboard
4. Connect your GitHub account and select your repository
5. Render will automatically detect the `render.yaml` file and set up the required services
6. Click "Apply" and wait for the deployment to complete

### Manual Deployment

1. Create a new Web Service in Render
   - Select your GitHub repo
   - Choose "Node" as the Runtime
   - Use these settings:
     - Build Command: `npm ci && npm run build`
     - Start Command: `npm start`
   - Add environment variables:
     - `NODE_ENV`: `production`
     - `DATABASE_URL`: Your database connection string
     - `SESSION_SECRET`: A secure random string

2. Create a PostgreSQL database in Render
   - Select "New" → "PostgreSQL" from the Render dashboard
   - Link it to your web service

3. After deployment, run database migrations by clicking "Manual Deploy" → "Clear build cache & deploy"

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Make sure PostgreSQL is running on your machine
2. Verify that the database name and credentials in your `.env` file are correct
3. Ensure that the PostgreSQL port is correct (default is 5432)
4. Check if the database has been created:
   ```bash
   psql -U postgres -c "SELECT datname FROM pg_database WHERE datname='softflowtech';"
   ```

### Running Database Migrations

If your database tables are not created properly:

1. Make sure your `.env` file contains the correct `DATABASE_URL`
2. Run the database push command:
   ```bash
   npm run db:push
   ```
3. Check the console for any errors during migration

### Port Conflicts

If you encounter a port conflict (default is 5000):

1. You can modify the port in `server/index.ts`:
   ```javascript
   const port = process.env.PORT || 3000; // Change to another port
   ```
2. Restart the server after changing the port

### Understanding the Code Structure

- **client/src/**: Frontend React application
- **server/**: Backend Express.js API
- **shared/**: Shared code including database schema
- **client/src/components/**: Reusable UI components
- **client/src/pages/**: Page components for each route
- **client/src/hooks/**: Custom React hooks
- **client/src/lib/**: Utility functions and API clients
- **server/routes.ts**: API endpoint definitions
- **server/storage.ts**: Database operations
- **shared/schema.ts**: Database schema definitions

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Manish - jmanishkumar.2003@gmail.com

Project Link: [https://github.com/manish-87/Soft-Flow-Tecnologies](https://github.com/manish-87/Soft-Flow-Tecnologies)
