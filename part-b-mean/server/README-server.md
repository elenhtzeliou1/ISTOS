# InfoHub Server (Part B – MEAN Stack Backend)

This repository contains the backend server for the InfoHub platform, built with Node.js, Express, and MongoDB.
The server exposes a REST API that is consumed by the InfoHub client application.

---

# Tech Stack
 - Node.js
 - Express.js
 - MongoDB (Local or MongoDB Atlas)
 - Mongoose
 - JWT Authentication

--- 

## Requirements
- Node.js / 
- npm
- MongoDB (local installation or MongoDB Atlas account)

---

## Installation & Setup

Navigate to the server directory:

```bash
cd part-b-mean/server
```

Environment Configuration:
- Copy the environment example file:

```bash
cp .env.example .env
```

Fill in the required environment variables in .env
 - MONGODB_URI
 - PORT
 - JWT_SECRET
 - JWT_EXPIRES_IN

see .env.example for more information


Install Dependencies:

```bash
npm install
```

Seed Database:

```bash
npm run seed:all
```

---

## Running the Server

 - Development Mode (with nodemon) 
```bash
        npm run dev
```
or
 - Production mode:
```bash
        npm start 
```

The server will be available at: 

http://localhost:5000

--- 

## REST API Endpoints

## Categories

GET `/api/categories`
GET `/api/categories/slug/:slug`
GET `/api/categories/:id`

--- 

## Courses

GET `/api/courses`
GET `/api/courses/proposed?limit=5`
GET `/api/courses/:id`

--- 

## Books

GET `/api/books`
GET `/api/books/proposed?limit=4`
GET `/api/books/by-ids?ids=1,2,3`
GET `/api/books/by-book-id/:bookId`
GET `/api/books/:id`

--- 

## Videos

GET `/api/videos`
GET `/api/videos/proposed?limit=3`
GET `/api/videos/by-ids?ids=1,2,3`
GET `/api/videos/:id`

---

## Users & Authentication

POST `/api/users` 

---

## Username / Email Availability Check

GET `/api/users/check?email=...&userName=...` 

---

## Login (JWT Authentication)

POST `/api/auth/login (επιστρέφει JWT token)`

--- 

## User Profile (Protected)

Requires Authorization: Bearer <token>

GET `/api/users/me`
PUT `/api/users/me` 

---

## Enrollments (Protected)
Create Enrollment: 
POST `/api/enrollments`
Body
{
  "course": "<courseId>"
}

Get User Enrollments:
GET `/api/enrollments/me/enrollments`

--- 

## Reviews

Public Endpoints:
GET `/api/reviews/course/:courseId`

Protected Endpoints (User must be authenticated and enrolled in the course):

GET `/api/reviews/course/:courseId/me` 
PUT `/api/reviews/course/:courseId` 
Creates or updates the logged-in user's review.
Body:
{
  "rating": 4,
  "comment": "Very helpful course!"
}

## Authentication Notes
For protected endpoints, include the following HTTP header:
 - Authorization: Bearer <token>

The token is obtained from:
 - POST /api/auth/login


## Testing with Postman
1. Seed the database:
```bash
npm run seed:all
```

2. Run the server:
```bash
npm run dev
```

3. Test example endpoints:
```bash
GET http://localhost:5000/api/courses
GET http://localhost:5000/api/books/proposed
GET http://localhost:5000/api/videos
```