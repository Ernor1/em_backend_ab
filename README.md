
# Employee Management Application - Attendance Tracking System

## Description

This application is an employee management system built using the NestJS framework. It provides functionality to manage employees, track attendance, send email notifications upon attendance records, and generate reports. The app is deployed on Render, and the deployment pipeline includes two jobs: testing and deployment. A link to the deployed project can be found in the project description.

## Features

- **Full Authentication System:**
  - Register, Login, Logout, Forgot password, Password reset functionalities using `PassportJS`.
  
- **Employee Management (CRUD):**
  - Manage employee records with fields like `name`, `email`, `employeeIdentifier`, and `phoneNumber`.

- **Attendance Tracking:**
  - Record employee check-ins and check-outs.

- **Email Notification System:**
  - Automatically send email notifications to employees when attendance is recorded using background processing queues.

- **Attendance Reports:**
  - Generate PDF reports using `jsPDF` and Excel reports using `ExcelJS` with daily attendance data.

- **API Documentation:**
  - Interactive and detailed API documentation is available through Swagger, using OpenAPI standards.

## Deployment Information

The application is deployed on Render, with a continuous integration (CI) pipeline that runs the following jobs:

1. **Test**: Executes the test suite to ensure all functionalities work as expected.
2. **Deploy**: Deploys the application to Render if all tests pass successfully.

You can find the deployment link in the project description.

## Technology Stack

- **NestJS v10**: Core framework for the API.
- **PassportJS**: For authentication.
- **TypeORM**: Database management and migrations using Prisma ORM.
- **Jest**: Testing framework.
- **jsPDF**: For generating PDF reports.
- **ExcelJS**: For generating Excel reports.
- **Bull Queues**: For background job processing.
- **OpenAPI (Swagger)**: For API documentation.
- **Render**: For application hosting and deployment.
- **Gemini AI (Google)**: Used for generating personalized email content due to ChatGPT being closed-source.

## Email Notification System

Emails are automatically sent to employees upon check-in. These emails are generated using **Gemini AI** by Google, which personalizes the content of the notification messages.

## Swagger Documentation

The application includes a well-detailed and interactive API documentation using Swagger, accessible at `/api-doc` (e.g., `https://em-backend-ab.onrender.com/api-doc`). It covers all available endpoints, request/response formats, and necessary authentication details.

## Bonus Features

- **GitHub Actions**: The CI pipeline is configured with GitHub Actions to run tests automatically on pull requests (PRs).

## Setup Instructions

### Prerequisites

- Node.js v18.x.x or higher
- npm v9.x.x or higher
- PostgreSQL or any other supported database
- Redis for background job processing (email notifications)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ernor1/em_backend_ab.git
   cd em_backend_ab
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and include the following variables:
   ```
   DATABASE_URL=your-database-url
   JWT_SECRET=your-jwt-secret
   MAIL_HOST=smtp.mailtrap.io
   MAIL_PORT=your-mail-port
   MAIL_USER=your-mail-username
   MAIL_PASS=your-mail-password
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Run database migrations:**
   ```bash
   npm run migration:run
   ```

5. **Start the application:**
   ```bash
   npm run start:dev
   ```

6. **Access the API Documentation:**
   Visit `http://localhost:8000/api-doc` to view the interactive Swagger documentation.

### Running Tests

- Run the tests with the following command:
  ```bash
  npm run test
  ```

- Check test coverage:
  ```bash
  npm run test:cov
  ```

### Generating Reports

- **PDF Reports:** 
  - Generate daily attendance data reports in PDF format using `jsPDF`.
  
- **Excel Reports:**
  - Generate Excel reports of attendance data using `ExcelJS`.

### Email Notifications

The application sends an email to employees upon check-in. The content is generated using **Gemini AI by Google** for personalized messages, instead of OpenAI's ChatGPT.

## Deployment

To deploy this project to Render or any other cloud provider, follow these steps:

1. Configure the environment variables based on the platform's guidelines.
2. Ensure Redis is available either as a managed service or locally.
3. Set up PostgreSQL or another supported database for the application.

## GitHub Actions

The project uses GitHub Actions for continuous integration. The workflow file located in `.github/workflows/main.yml` is configured to automatically run tests when a pull request (PR) is created.

## Conclusion

This Employee Management application is a complete solution for managing employees and attendance tracking. It integrates modern web development practices such as authentication, background processing, email notifications, and detailed API documentation. 

For any further questions or issues, feel free to reach out.
