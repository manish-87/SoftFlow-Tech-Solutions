# Deploying to Render

Follow these steps to deploy the SoftFlow Technologies website to Render:

## Prerequisites

1. GitHub account with the repository pushed (https://github.com/manish-87/Soft-Flow-Tecnologies)
2. Render account (email: jmanishkumar.2003@gmail.com)

## Deployment Steps

### Option 1: Using Render Blueprint (Recommended)

1. Log in to your Render account at https://dashboard.render.com/
2. Click on "New" and select "Blueprint" from the dropdown
3. Connect your GitHub account if not already connected
4. Select the "manish-87/Soft-Flow-Tecnologies" repository
5. Render will automatically detect the `render.yaml` file and create the web service and database
6. Click "Apply Blueprint" to start the deployment
7. Wait for the deployment to complete (this may take a few minutes)
8. Your application will be available at a URL similar to `https://softflow-technologies.onrender.com`

### Option 2: Manual Deployment

If the Blueprint method doesn't work for any reason, you can manually set up the services:

1. **Create a PostgreSQL Database:**
   - Log in to your Render account
   - Go to "Dashboard" and click "New" > "PostgreSQL"
   - Configure the database:
     - Name: `softflow-tech-db`
     - Region: `US` (Ohio)
     - PostgreSQL Version: 15 (or latest)
     - Instance Type: Free
   - Click "Create Database"
   - Copy the "Internal Database URL" once it's created

2. **Create a Web Service:**
   - Go back to the Dashboard and click "New" > "Web Service"
   - Connect your GitHub repository
   - Configure the web service:
     - Name: `softflow-technologies`
     - Region: `US` (Ohio)
     - Branch: `main`
     - Root Directory: Leave empty
     - Runtime: `Node`
     - Build Command: `npm ci && npm run build`
     - Start Command: `npm start`
     - Instance Type: Free
   - Add the following environment variables:
     - `NODE_ENV`: `production`
     - `DATABASE_URL`: Paste the Internal Database URL from the previous step
     - `SESSION_SECRET`: Generate a random string (you can use a password generator)
   - Click "Create Web Service"

3. **Monitor the Deployment:**
   - Wait for the initial deployment to complete
   - Check the logs for any errors
   - Once successful, your site will be available at the provided URL

## Troubleshooting

- **Build Failures**: Check the build logs for specific errors
- **Database Connection Issues**: Verify that the `DATABASE_URL` environment variable is correctly set
- **Application Errors**: Check the application logs in the Render dashboard

## Post-Deployment

1. Go to your deployed application URL
2. Login with the admin account:
   - Username: `admin`
   - Password: `JMk@475869`
3. Verify that all features are working as expected

## Notes

- The free tier of Render has some limitations:
  - Services spin down after periods of inactivity (may cause slow initial loads)
  - Limited database storage and connections
  - Limited bandwidth

- For production use, consider upgrading to a paid plan for better performance and reliability