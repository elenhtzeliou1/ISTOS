# Part B – MEAN E-Learning Platform

This repository contains **Part B** of the Web Development project, extending **Part A**
into a full **client–server application** following the **MEAN architecture**
(MongoDB, Express, Angular/Modular JS, Node.js).

The application implements a simple **e-learning platform**, where:
- the **backend** provides a REST API (Node.js + Express + MongoDB),
- the **frontend** consumes the API and renders dynamic content,
- **no HTML is served by the server**, only JSON data.

---

## Folder Stracture
- `server/` → Node/Express API + MongoDB (Mongoose)
- `client/` → Angular (standalone components) + Vite dev server

---

## Prerequisites

Before running the project, ensure you have:

- **Node.js ≥ 18**
- **npm ≥ 9**
- **MongoDB** (local installation or MongoDB Atlas)

Verify installation:

```bash
node -v
npm -v
```

---

## Backend – Server Setup: 

### 1) Navigate to server Folder
```bash
cd part-b-mean/server
```

### 2) Install dependencies
```bash
npm install
```

### 3) Environment variables

cp .env.example .env   # set the .env with proper values -> see .env.example

> If you use MongoDB Atlas, set `MONGODB_URI` to your Atlas connection string. For more information see the given .env.example

---

### 4) Seed the database (initial data)

The project includes seed scripts to populate the database with example data.

```bash
npm run seed:all
```

(This command, will insert sample courses, categories, reviews, videos, books and some users into MongoDB.)

---

### 5) Start the server
```bash
-Development (nodemon):
    npm run dev για 
or 
-για Production mode
npm start 
```

(we reccomend npm start)

```

The server will run at:

```text
http://localhost:5000
```

---

## Backend – Available API Endpoints

> The backend returns **JSON** and uses appropriate HTTP status codes (200/201/400/404/500).

Some example endpoints:

| Method | Endpoint           | Description               |
|------- |------------------- |------------------------   |
| GET    | `/api/courses`     | Retrieve all courses      |
| GET    | `/api/courses/:id` | Retrieve course details   |
| POST   | `/api/users`       | Register a new user       |
| POST   | `/api/enrollments` | Enroll a user in a course |
| POST   | `/api/reviews`     | Submit a course review    |

For more information about the working endpoints, check README-server.md

---

## Frontend – Client Setup

### 1) Navigate to the client folder

```bash
cd part-b-mean/client
```

### 2) Install dependencies

```bash
npm install
```


### 3) Start the client

```bash
npm run dev
```

The client will run at:

```text
http://localhost:5173
```

--- 

## Client–Server Communication

- The frontend **does not contain hardcoded data** for entities stored in MongoDB.
- All dynamic content (courses list,book-list,video-list, course details, book-details, video-details, registration,login, enrollments, reviews) is handled via REST API calls.
- API requests are centralized in:

```text
client/src/app/services/api.service.ts
```

---

## Application Flow (High Level)

1. User opens the frontend (client)
2. Frontend requests data via REST API
3. Server queries MongoDB
4. Server returns JSON responses from MongoDB (via Mongoose models)
5. Frontend renders content dynamically

---

## User Actions:

 - Register: POST /api/users
 - Login: POST /api/auth/login (returns JWT)
 - Enroll: POST /api/enrollments (JWT required)
 - Review: PUT /api/reviews/course/:courseId (JWT + enrollment required)

The client uses Vite’s proxy so it can call /api/* without a hardcoded backend URL.

---

##  Implemented Functionality

 - Dynamic loading of lists (courses, books, videos, categories) from MongoDB via REST API
 - Recommended content (proposed endpoints for courses/books/videos)
 - User registration and login (JWT-based authentication)
 - User profile management (GET/PUT /me)

 - Course enrollment (JWT-protected)

 - Course reviews (public read + protected create/update)

--- 

## Endpoints (Summary)

Auth: 
 - POST /api/auth/login

Users: 
 - POST /api/users, 
 - GET /api/users/check, 
 - GET/PUT /api/users/me

Categories: 
 - GET /api/categories, 
 - GET /api/categories/:id

Courses: 
 - GET /api/courses, 
 - GET /api/courses/proposed, ή και GET /api/courses/proposed?limit=4
 - GET /api/courses/:id

Books:
 - GET /api/books, 
 - GET /api/books/proposed, 
 - GET /api/books/by-book-id/:bookId, 
 - GET /api/books/:id

Videos: 
 - GET /api/videos, 
 - GET /api/videos/proposed, 
 - GET /api/videos/:id
 - GET /api/videos/by-ids?ids=1 

---

Users: 
Register: 
 - POST /api/users, 
 required body: 
BODY: {
  "firstName": "John", 
  "lastName": "Doe",
  "userName": "JohnDoe", 
  "email":"johnDoe@gmail.com", 
  "dob": "2000-03-01", 
  "interest": "Programming", 
  "level": "Beginner", 
  "goal": "Learn web development", 
  "newsletter": false, 
  "password": "123456e" 
}

---

Login:
 - POST /api/auth/login
required body: 
BODY: {
  "email": "johnDoe@gmail.com",
  "password": "123456e"
}

Save the returned token — it is required for subsequent endpoints.

---

User Profile
 - GET /api/users/me

---

Enrollments: 
Create an enrollment:
Body {
    "course" : "694b365abc0529f3daed8b9f"
    }
 - POST /api/enrollments, 

Get all the enrollments for the logged in user:
 - GET /api/enrollments/me/enrollments

---

Reviews: 
Get reviews for a course:
 - GET /api/reviews/course/:courseId, 

Create a review (User must be enrolled in the course):
body {
   "rating": 4,
    "comment": "I find the course very helpful—well done!"
}
PUT /api/reviews/course/:courseId

Get your own review for a course 
 - GET /api/reviews/course/:courseId/me, 

---

## Environment Configuration

The server uses the following environment variables:

 - MONGODB_URI
 - PORT
 - JWT_SECRET
 - JWT_EXPIRES_IN

See: server/.env.example

--- 

## Error Handling

- Invalid requests return proper HTTP error codes (e.g., `400`, `404`)
- Client displays success or failure messages based on server responses
- Server includes centralized error handling middleware

---

ELENI TZELIOU: 3220200
NAPOLEON HARALAMPIDIS: 3220225

---