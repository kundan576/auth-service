#  Auth Service (Node.js)

A scalable and secure authentication microservice built with Node.js, featuring JWT-based authentication, role-based access control (RBAC), and Docker support.

---

##  Features

* User Registration & Login
* JWT Authentication (Access Tokens)
* Role-Based Access Control (RBAC)
* Password Reset via Email
* Input Validation using DTOs
* Centralized Error Handling (ApiError)
* Standardized API Responses (ApiResponse)
* Modular Architecture
* Docker & Docker Compose support

---

##  Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT (JSON Web Tokens)
* Nodemailer
* Docker

---

##  Project Structure

```
src/
 ├── common/
 │    ├── config/
 │    ├── dto/
 │    ├── middleware/
 │    └── utils/
 │         ├── api-error.js
 │         ├── api-response.js
 │         └── jwt.utils.js
 │
 ├── modules/
 │    └── auth/
 │         ├── dto/
 │         ├── auth.controller.js
 │         ├── auth.middleware.js
 │         ├── auth.model.js
 │         ├── auth.routes.js
 │         └── auth.service.js
 │
 ├── app.js
server.js
```

---

##  Authentication & Authorization

### JWT Authentication

* Token generated on login
* Token contains user ID and role
* Used for securing routes

### Role-Based Access Control (RBAC)

* Roles: `USER`, `ADMIN`
* Middleware-based authorization
* Route protection using roles

Example:

```
GET /admin → ADMIN only
GET /profile → USER & ADMIN
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/kundan576/auth-service.git
cd auth-service
```

---

### 2. Install dependencies

```
npm install
```

---

### 3. Configure environment variables

Create a `.env` file:

```
PORT=8080
DB_URL=your_database_url
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

### 4. Run the server

```
npm run dev
```

---

##  Docker Setup

```
docker-compose up --build
```

---

##  API Endpoints

| Method | Endpoint          | Description      |
| ------ | ----------------- | ---------------- |
| POST   | /auth/register    | Register user    |
| POST   | /auth/login       | Login user       |
| POST   | /auth/forgot-pass | Send reset email |
| POST   | /auth/reset-pass  | Reset password   |
| GET    | /auth/profile     | User profile     |
| GET    | /auth/admin       | Admin-only route |

## All API endpoints have been tested using Postman.
---

##  API Response Format

###  Success

```
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

###  Error

```
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

---

##  Future Improvements

* Refresh Tokens
* OAuth (Google Login)
* Rate Limiting
* Role & Permission Management (Advanced RBAC)
* API Documentation (Swagger)

---

##  Author

**Kundan Kumar**

GitHub: https://github.com/kundan576
