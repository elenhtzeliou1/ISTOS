# Backend Server — Part B (MEAN Architecture)

This folder contains the **backend implementation** of **Part B** of the project.
The backend is a **REST API** built with **Node.js**, **Express**, and **MongoDB**, and it exposes endpoints used by the client to retrieve and store data for the e-learning platform.

The server **does not render HTML** and **does not include frontend code**.
All communication is performed via **JSON over HTTP**.

---

## 1. Prerequisites

Before running the server, make sure you have:

- **Node.js** (v18 or newer recommended)
- **npm**
- **MongoDB**
  - Either a local MongoDB installation
  - Or a MongoDB Atlas cluster

---

## 2. Installation

From the `server/` directory, install the required dependencies:

```bash
npm install
```

This will install:
- Express
- Mongoose
- dotenv
- cors
- nodemon (development)

---

## 3. Environment Variables

Create a file named `.env` in the `server/` directory.

Example configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elearning
```

Explanation:
- **PORT**: The port on which the Express server will run
- **MONGODB_URI**: MongoDB connection string

---

## 4. Running the Server

### Development mode
```bash
npm run dev
```

Expected output:
```
MongoDB connected
Server running on http://localhost:5000
```

---

## 5. Project Structure (Backend)

```
server/
├── package.json
├── .env.example
├── src/
│   ├── app.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── courses.routes.js
│   │   ├── users.routes.js
│   │   ├── enrollments.routes.js
│   │   └── reviews.routes.js
│   ├── controllers/
│   │   ├── courses.controller.js
│   │   ├── users.controller.js
│   │   ├── enrollments.controller.js
│   │   └── reviews.controller.js
│   └── middleware/
│       └── errorHandler.js
```

---

## 6. REST API Endpoints

### Courses
- **GET** `/api/courses`  
  Returns the list of all courses.

- **GET** `/api/courses/:id`  
  Returns details of a specific course.

---

### Users
- **POST** `/api/users`  
  Registers a new user.

**Request body (JSON):**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password",
  "preferences": {
    "categories": ["Programming"],
    "level": "Beginner"
  }
}
```

---

### Enrollments
- **POST** `/api/enrollments`  
  Enrolls a user in a course.

**Request body (JSON):**
```json
{
  "user": "<USER_ID>",
  "course": "<COURSE_ID>"
}
```

---

### Reviews
- **POST** `/api/reviews`  
  Submits a simple review for a course.

**Request body (JSON):**
```json
{
  "user": "<USER_ID>",
  "course": "<COURSE_ID>",
  "rating": 4,
  "comment": "Very useful course"
}
```

---

## 7. Error Handling

The server returns appropriate HTTP status codes:

- **200 OK** – Successful GET request
- **201 Created** – Successful POST request
- **400 Bad Request** – Invalid or missing data
- **404 Not Found** – Resource does not exist
- **500 Internal Server Error** – Server or database error

All responses are returned in **JSON format**.

---

## 8. Notes for Frontend Integration

- All data is retrieved from the backend via REST API calls.
- No hardcoded data exists in the server.
- The client should use `fetch` (or similar) to communicate with the endpoints listed above.
- The backend does not require authentication or login for Part B.

---

## 9. Testing

Endpoints can be tested using:
- **Postman**
- or `curl`

Successful requests return the corresponding JSON response and status code.

---

**This backend implementation satisfies all functional requirements of Part B of the assignment.**
