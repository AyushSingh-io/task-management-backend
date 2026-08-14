# Task Management Backend

A RESTful backend API for a task management application built with **Node.js, Express.js, and MongoDB**.

The application provides secure authentication, project collaboration, role-based access control, task management, comments, file uploads, and transactional database operations.

> **Project Status: ✅ Backend Completed**

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **Mongoose**
- **JWT** — Access & Refresh Tokens
- **Bcrypt** — Password Hashing
- **Cloudinary** — Image Storage
- **Multer** — File Uploads
- **Cookie Parser**

---

## ✨ Features

### 🔐 Authentication & Users

- User registration
- User login and logout
- JWT authentication
- Access token and refresh token management
- HTTP-only cookie authentication
- Refresh token rotation
- Password hashing using Bcrypt
- Change password
- Update user profile
- Upload and update user avatar
- Get current authenticated user

### 📁 Project Management

- Create projects
- Get projects
- Get project by ID
- Update projects
- Delete projects
- Project status management
- Project cover image upload
- Owner-based project authorization

### 👥 Project Members & Roles

- Add project members
- Remove project members
- Get project members
- Change member roles
- Transfer project ownership
- Role-Based Access Control (RBAC)
- Owner, Admin, and Member roles
- Project-level permission checks

### ✅ Task Management

- Create tasks
- Get project tasks
- Get task by ID
- Get assigned tasks
- Update tasks
- Delete tasks
- Task status management
- Task priority management
- Task assignment
- Due dates
- Task authorization
- Assignee-based task status updates

### 💬 Comments

- Create comments
- Get task comments
- Update own comments
- Delete comments
- Admin/Owner comment moderation
- Project-level authorization

### ☁️ File Management

- Cloudinary integration
- User avatar uploads
- Project cover image uploads
- Image replacement
- Old image cleanup
- Multer file handling

### 🛡️ Security & Authorization

- JWT authentication
- HTTP-only cookies
- Access and refresh tokens
- Password hashing
- Role-Based Access Control
- Project-level authorization
- Resource-level authorization
- Protected routes
- Permission service
- Unauthorized resource access protection

### 🗄️ Database & Backend

- MongoDB transactions
- Database indexing
- Database query optimization
- Optimized database queries
- Production-oriented update flows
- Production-oriented delete flows
- Centralized error handling
- Custom API errors
- Standardized API responses
- Async error handling

---

## 📂 Project Structure

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

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-management-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Note:** Never commit your `.env` file or expose your secrets publicly.

### 4. Run the Development Server

```bash
npm run dev
```

The API will start on:

```text
http://localhost:8000
```

---

## 🔑 Authentication

The application uses **JWT-based authentication** with separate access and refresh tokens.

Authentication includes:

- Access tokens
- Refresh tokens
- HTTP-only cookies
- Refresh token rotation
- Password hashing with Bcrypt
- Protected routes
- Authentication middleware

---

## 🔐 Authorization

The application uses **Role-Based Access Control (RBAC)** at the project level.

### Roles

```text
OWNER
ADMIN
MEMBER
```

Permissions are determined by the user's role within a specific project.

### Example Permission Model

| Action | OWNER | ADMIN | MEMBER |
|---|:---:|:---:|:---:|
| Manage Project | ✅ | ❌ | ❌ |
| Add Members | ✅ | ✅ | ❌ |
| Remove Members | ✅ | ✅* | ❌ |
| Change Roles | ✅ | ❌ | ❌ |
| Transfer Ownership | ✅ | ❌ | ❌ |
| Create Tasks | ✅ | ✅ | ❌ |
| Update Tasks | ✅ | ✅ | ❌ |
| Delete Tasks | ✅ | ✅ | ❌ |
| Update Assigned Task Status | ✅ | ✅ | ✅ |
| Create Comments | ✅ | ✅ | ✅ |
| Update Own Comments | ✅ | ✅ | ✅ |
| Delete Own Comments | ✅ | ✅ | ✅ |

\* Admins cannot remove other Admins or the Project Owner.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/users/register` | Register a new user |
| `POST` | `/api/v1/users/login` | Login user |
| `POST` | `/api/v1/users/logout` | Logout user |
| `POST` | `/api/v1/users/refresh-token` | Refresh access token |

### Users

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/users/me` | Get logged-in user |
| `PATCH` | `/api/v1/users/update-profile` | Update profile |
| `PATCH` | `/api/v1/users/change-password` | Change password |
| `PATCH` | `/api/v1/users/update-avatar` | Update avatar |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/projects` | Create project |
| `GET` | `/api/v1/projects` | Get projects |
| `GET` | `/api/v1/projects/:projectId` | Get project by ID |
| `PATCH` | `/api/v1/projects/:projectId` | Update project |
| `DELETE` | `/api/v1/projects/:projectId` | Delete project |

### Project Members

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/projects/:projectId/members/:memberId` | Add project member |
| `GET` | `/api/v1/projects/:projectId/members` | Get project members |
| `GET` | `/api/v1/projects/:projectId/members/:memberId` | Get project member |
| `PATCH` | `/api/v1/projects/:projectId/members/:memberId` | Change member role |
| `DELETE` | `/api/v1/projects/:projectId/members/:memberId` | Remove project member |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/projects/:projectId/tasks` | Create task |
| `GET` | `/api/v1/projects/:projectId/tasks` | Get project tasks |
| `GET` | `/api/v1/tasks` | Get assigned tasks |
| `GET` | `/api/v1/tasks/:taskId` | Get task by ID |
| `PATCH` | `/api/v1/tasks/:taskId` | Update task |
| `DELETE` | `/api/v1/tasks/:taskId` | Delete task |
| `PATCH` | `/api/v1/tasks/:taskId/assign` | Assign task |
| `PATCH` | `/api/v1/tasks/:taskId/status` | Update task status |

### Comments

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/comments/tasks/:taskId` | Create comment |
| `GET` | `/api/v1/comments/tasks/:taskId` | Get task comments |
| `PATCH` | `/api/v1/comments/:commentId` | Update comment |
| `DELETE` | `/api/v1/comments/:commentId` | Delete comment |

---

## 🗄️ Database Design

The application uses **MongoDB with Mongoose**.

Main entities:

```text
User
 │
 ├── Project (owner)
 │     │
 │     ├── ProjectMember
 │     │
 │     └── Task
 │           │
 │           └── Comment
 │
 └── Task (assignedTo)
```

MongoDB transactions are used for operations that modify multiple related documents and require atomicity.

Examples include:

- Project deletion
- Task deletion with comments
- Project ownership transfer

Database indexes are used to support frequently executed queries and enforce relevant uniqueness constraints.

---

## 🧩 Error Handling

The backend uses centralized error handling through:

- Custom `ApiError`
- Standardized `ApiResponse`
- `asyncHandler`
- Centralized Express error middleware
- MongoDB/Mongoose error handling
- Consistent HTTP status codes

---

## 🧪 Testing

The backend has been tested across:

- Authentication flows
- Login/logout
- Access token refresh
- Authorization and role permissions
- Project CRUD operations
- Project member management
- Role changes
- Ownership transfer
- Task CRUD operations
- Task assignment
- Task status updates
- Comment operations
- Unauthorized access
- Invalid requests
- Duplicate resources
- Failure cases

---

## 🚧 Future Improvements

The backend core is complete.

Possible future improvements include:

- Search and filtering
- Pagination
- API documentation
- Automated test suite
- Rate limiting
- Logging and monitoring
- Caching


---

## 📌 Project Status

### ✅ Backend Completed

The backend currently includes:

- User Authentication
- JWT Access & Refresh Tokens
- HTTP-only Cookie Authentication
- User Management
- Project Management
- Project Collaboration
- Role-Based Access Control
- Project-level Authorization
- Task Management
- Task Assignment
- Task Status Management
- Comments
- Cloudinary Integration
- MongoDB Transactions
- Database Indexing
- Query Optimization
- Centralized Error Handling
- Protected API Routes
- Production-oriented Update/Delete Flows

The backend is **feature-complete and ready to be integrated with a frontend application.**

---

## 📄 License

This project is intended for **learning and portfolio purposes**.
