# Participant Management Portal

An Angular web application for managing participating financial institutions. The portal supports authentication, participant listing, searching, adding, editing, and deleting participant records, with logo upload functionality.

## Technologies Used

- Angular 22
- TypeScript
- Bootstrap 5
- RxJS
- REST API integration
- Git and GitHub

## Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- Angular CLI
- The Participant Management Portal backend
- PostgreSQL and any backend authentication services required by the backend configuration

## Getting Started

### 1. Clone the repository

```bash
git clone <https://github.com/Abangiti/participant-management-portal.git>
cd participant-management-portal

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API URL

The development API configuration is located at:

`src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:9081/api/v1'
};
```

Ensure the backend is running at the configured address. The participant institution endpoints may use a different API path, as configured in the participant service.

### 4. Start the backend

Start the corresponding Spring Boot backend and configure its database and authentication requirements according to the backend project's documentation.

The frontend expects the backend to be accessible on port `9081`.

### 5. Run the frontend

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

The development server automatically reloads when source files change.

## Building the Project

Run:

```bash
ng build
```

The generated build files are stored in the `dist/` directory.

## Running Unit Tests

Run:

```bash
ng test
```

## Generating Angular Components

To generate a component:

```bash
ng generate component component-name
```

For other Angular CLI commands:

```bash
ng generate --help
```

## Environment Configuration

Keep environment-specific API settings in the environment configuration files rather than hardcoding URLs throughout the application.

- Development: `src/environments/environment.ts`
- Production: configure a production environment file and deployment API URL when preparing the production deployment.


## Additional Resources

- [Angular Documentation](https://angular.dev/)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [Bootstrap Documentation](https://getbootstrap.com/)
