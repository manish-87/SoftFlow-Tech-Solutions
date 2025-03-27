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

## Tech Stack

- **Frontend**: React, Tailwind CSS, Shadcn UI Components
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with custom verification
- **State Management**: React Query

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/manish-87/Soft-Flow-Tecnologies.git
   cd Soft-Flow-Tecnologies
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/database
   SESSION_SECRET=your_secret_key
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

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

## Default Admin Credentials

- Username: admin
- Password: JMk@475869

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