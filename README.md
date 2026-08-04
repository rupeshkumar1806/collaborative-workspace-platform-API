# collaborative-workspace-platform-API

A RESTful backend API for collaborative project management built with Node.js, Express.js, Prisma ORM, and PostgreSQL.

The API provides secure authentication, organization and project management, task assignment, team collaboration through comments, member invitations, and activity tracking with role-based access control.

## Live API

https://collaborative-workspace-platform-api-1.onrender.com

## Repository

https://github.com/rupeshkumar1806/collaborative-workspace-platform-API
---

## Features

- JWT-based Authentication
- Role-Based Authorization
- Organization Management
- Project Management
- Task Assignment & Tracking
- Task Comments
- Organization Invitations
- Activity Logging
- Prisma ORM with PostgreSQL
- Database Migrations
- Cascade Delete Relationships

---

## Tech Stack

**Backend**
- Node.js
- Express.js

**Database**
- PostgreSQL
- Prisma ORM

**Authentication**
- JSON Web Token (JWT)
- bcrypt

**Deployment**
- Render
- Neon PostgreSQL

---

## API Endpoints

### Authentication

```
POST   /api/auth/register
POST   /api/auth/login
```

### Organizations

```
POST   /api/org/create
GET    /api/org/get
PUT    /api/org/update/:organizationId
DELETE /api/org/delete/:organizationId
```

### Projects

```
POST   /api/project/create/:organizationId
GET    /api/project/get/:organizationId
PUT    /api/project/update/:projectId
DELETE /api/project/delete/:projectId
```

### Tasks

```
POST   /api/task/create/:projectId
GET    /api/task/get/:projectId
PUT    /api/task/update/:taskId
DELETE /api/task/delete/:taskId
```

### Comments

```
POST   /api/comment/create/:taskId
GET    /api/comment/get/:taskId
PUT    /api/comment/update/:commentId
DELETE /api/comment/delete/:commentId
```

### Invitations

```
POST   /api/invitation/invite/:organizationId
GET    /api/invitation/get/:organizationId
```

### Activity

```
GET    /api/activity/:projectId
```

---

## Project Structure

```
.
├── prisma
│   ├── migrations
│   └── schema.prisma
│
├── src
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── utils
│   ├── app.js
│   └── server.js
│
├── package.json
└── README.md
```

---

## Local Setup

Clone the repository

```bash
git clone https://github.com/rupeshkumar1806/collaborative-workspace-platform-API.git
```

Install dependencies

```bash
npm install
```

Configure environment variables

```env
DATABASE_URL=your_database_url
JWT_KEY=your_secret_key
PORT=3000
```

Apply database migrations

```bash
npx prisma migrate deploy
```

Start the development server

```bash
npm run dev
```

Production

```bash
npm start
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL database connection string |
| JWT_KEY | Secret key used to sign JWT tokens |
| PORT | Application port |

---

## Database

The application uses PostgreSQL with Prisma ORM for data modeling and migrations.

Core entities include:

- User
- Organization
- OrganizationMember
- Project
- ProjectMember
- Task
- Comment
- Invitation
- Activity

---

## License

This project is available for learning and demonstration purposes.

---

## Author

Rupesh Kumar

GitHub: https://github.com/rupeshkumar1806
