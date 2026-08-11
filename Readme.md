# Task Management Backend

A RESTful backend API for a task management application built with **Node.js**, **Express.js**, and **MongoDB**. The application supports secure JWT authentication, project collaboration, task management, comments, and role-based access control.

> **Project Status:** 🚧 Core Backend Completed — Optimization in Progress

---

## Tech Stack

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT (Access & Refresh Tokens)
* Bcrypt
* Cloudinary
* Multer
* Cookie Parser

---

## Features

### ✅ Implemented

#### Authentication & Users

* User Registration
* User Login & Logout
* JWT Authentication
* Access & Refresh Token Management
* Secure HTTP-only Cookie Authentication
* Change Password
* Update User Profile
* Upload & Update Avatar (Cloudinary)
* Get Current User Profile

#### Projects

* Create Project
* Get Projects
* Get Project by ID
* Update Project
* Delete Project
* Project Status Management
* Project Cover Image Upload

#### Project Members & Roles

* Add Project Members
* Remove Project Members
* Change Member Roles
* Role-based Access Control
* Owner, Admin & Member Roles

#### Tasks

* Create Tasks
* Get Tasks
* Update Tasks
* Delete Tasks
* Task Status & Priority
* Task Assignment
* Due Dates
* Task Authorization

#### Comments

* Create Comments
* Get Task Comments
* Update Comments
* Delete Comments

#### Other

* Cloudinary Image Uploads
* Authentication Middleware
* Permission Checks
* Centralized Error Handling
* MongoDB Transactions

---

## Project Structure

```text
src/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── services/
├── utilities/
├── database/
├── app.js
└── index.js
```

---

## Getting Started

### Clone the repository

```bash
git clone <repository-url>
cd task-management-backend
```

### Install dependencies

```bash
npm install
```

### Create a `.env` file

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run the development server

```bash
npm run dev
```

---

## Authentication

This project uses **JWT-based authentication** with:

* Access Tokens
* Refresh Tokens
* HTTP-only Cookies
* Password Hashing using Bcrypt

---

## API Endpoints

### Authentication

| Method | Endpoint                      | Description          |
| ------ | ----------------------------- | -------------------- |
| POST   | `/api/v1/users/register`      | Register a new user  |
| POST   | `/api/v1/users/login`         | Login user           |
| POST   | `/api/v1/users/logout`        | Logout user          |
| POST   | `/api/v1/users/refresh-token` | Refresh access token |

### User

| Method | Endpoint                        | Description        |
| ------ | ------------------------------- | ------------------ |
| GET    | `/api/v1/users/me`              | Get logged-in user |
| PATCH  | `/api/v1/users/update-profile`  | Update profile     |
| PATCH  | `/api/v1/users/change-password` | Change password    |
| PATCH  | `/api/v1/users/update-avatar`   | Update avatar      |

### Projects

| Method | Endpoint                      | Description       |
| ------ | ----------------------------- | ----------------- |
| POST   | `/api/v1/projects`            | Create project    |
| GET    | `/api/v1/projects`            | Get projects      |
| GET    | `/api/v1/projects/:projectId` | Get project by ID |
| PATCH  | `/api/v1/projects/:projectId` | Update project    |
| DELETE | `/api/v1/projects/:projectId` | Delete project    |

### Project Members

| Method | Endpoint                                        | Description           |
| ------ | ----------------------------------------------- | --------------------- |
| POST   | `/api/v1/projects/:projectId/members/:memberId` | Add project member    |
| GET    | `/api/v1/projects/:projectId/members`           | Get project members   |
| GET    | `/api/v1/projects/:projectId/members/:memberId` | Get project member    |
| PATCH  | `/api/v1/projects/:projectId/members/:memberId` | Change member role    |
| DELETE | `/api/v1/projects/:projectId/members/:memberId` | Remove project member |

### Tasks

| Method | Endpoint                            | Description        |
| ------ | ----------------------------------- | ------------------ |
| POST   | `/api/v1/projects/:projectId/tasks` | Create task        |
| GET    | `/api/v1/projects/:projectId/tasks` | Get project tasks  |
| GET    | `/api/v1/tasks`                     | Get assigned tasks |
| GET    | `/api/v1/tasks/:taskId`             | Get task by ID     |
| PATCH  | `/api/v1/tasks/:taskId`             | Update task        |
| DELETE | `/api/v1/tasks/:taskId`             | Delete task        |
| PATCH  | `/api/v1/tasks/:taskId/assign`      | Assign task        |
| PATCH  | `/api/v1/tasks/:taskId/status`      | Update task status |

### Comments

| Method | Endpoint                         | Description       |
| ------ | -------------------------------- | ----------------- |
| POST   | `/api/v1/comments/tasks/:taskId` | Create comment    |
| GET    | `/api/v1/comments/tasks/:taskId` | Get task comments |
| PATCH  | `/api/v1/comments/:commentId`    | Update comment    |
| DELETE | `/api/v1/comments/:commentId`    | Delete comment    |

---

## Current Progress

### ✅ Completed

* User Authentication
* User Management
* Project Management
* Project Members & Roles
* Task Management
* Task Assignment
* Comments
* Cloudinary Integration
* Role-based Authorization
* Centralized Error Handling
* MongoDB Transactions

### 🚧 Currently Working On

* Database Query Optimization
* MongoDB Query Improvements
* Database Indexing
* Improving Update Flows

---

## Future Improvements

* Search & Filtering
* Pagination
* API Documentation

---

## License

This project is intended for learning and portfolio purposes.
