# Task Management Backend

A RESTful backend API for a task management application built with **Node.js**, **Express.js**, and **MongoDB**. The application supports secure JWT authentication, project collaboration, task management, and role-based access control.

> **Project Status:** 🚧 Under Development

---

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (Access & Refresh Tokens)
- Bcrypt
- Cloudinary
- Multer
- Cookie Parser

---

## Features

### ✅ Implemented

- User Registration
- User Login & Logout
- JWT Authentication
- Access & Refresh Token Management
- Secure HTTP-only Cookie Authentication
- Change Password
- Update User Profile
- Upload & Update Avatar (Cloudinary)
- Get Current User Profile

### 🚧 Planned

- Project Management
- Task Management
- Project Members & Roles
- Comments
- Activity Logs
- Notifications

---

## Project Structure

```text
src/
├── controllers/
├── models/
├── routes/
├── middlewares/
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

- Access Tokens
- Refresh Tokens
- HTTP-only Cookies
- Password Hashing using Bcrypt

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/users/register` | Register a new user |
| POST | `/api/v1/users/login` | Login user |
| POST | `/api/v1/users/logout` | Logout user |
| POST | `/api/v1/users/refresh-token` | Refresh access token |

### User

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/users/current-user` | Get logged-in user |
| PATCH | `/api/v1/users/update-profile` | Update profile |
| PATCH | `/api/v1/users/change-password` | Change password |
| PATCH | `/api/v1/users/update-avatar` | Update avatar |

---

## Future Improvements

- Project CRUD APIs
- Task CRUD APIs
- Task Assignment
- Role-based Authorization
- Search & Filtering
- Pagination
- Email Notifications
- Unit & Integration Tests

---

## License

This project is intended for learning and portfolio purposes.