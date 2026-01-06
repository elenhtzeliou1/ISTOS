# InfoHub Server (Part B - MEAN)

Backend για την πλατφόρμα InfoHub (Node.js + Express + MongoDB).
Ο server παρέχει REST API που χρησιμοποιείται από τον client.

## Requirements
- Node.js (LTS)
- MongoDB Community Server (local) ή MongoDB Atlas
- npm

## Setup
```bash
cd part-b-mean/server


ΟΔΗΓΙΕΣ: 
Αντιγράψτε το .env.example σε .env”
Συμπληρώστε MONGODB_URI, PORT, JWT_SECRET”
npm install
“Τρέξτε npm run dev”


cp .env.example .env
# edit .env and set MONGODB_URI / JWT_SECRET
npm install
npm run seed:all
npm run dev


Dev mode (nodemon):
npm run dev

Production mode:
npm start

#######################################################
#######################################################

Βασικά Endpoints

Categories
GET /api/categories
GET /api/categories/slug/:slug
GET /api/categories/:id

Courses
GET /api/courses
GET /api/courses/proposed?limit=5
GET /api/courses/:id

Books
GET /api/books
GET /api/books/proposed?limit=4
GET /api/books/by-ids?ids=1,2,3
GET /api/books/by-book-id/:bookId
GET /api/books/:id

Videos
GET /api/videos
GET /api/videos/proposed?limit=3
GET /api/videos/by-ids?ids=1,2,3
GET /api/videos/:id

Users / Auth
POST /api/users (register)
GET /api/users/check?email=...&userName=... (availability check)
POST /api/auth/login (επιστρέφει JWT token)

Profile (Protected)
GET /api/users/me (requires Authorization Bearer token)
PUT /api/users/me (requires Authorization Bearer token)

Enrollments (Protected)
POST /api/enrollments body: { "course": "<courseId>" }
GET /api/enrollments/me/enrollments

Reviews
Public:
GET /api/reviews/course/:courseId

Protected (μόνο αν logged in + enrolled στο course):
GET /api/reviews/course/:courseId/me
PUT /api/reviews/course/:courseId body: { "rating": number, "comment": string }


Authentication
Στα protected endpoints στέλνεις header:
Authorization: Bearer <token>

Το token λαμβάνεται από:
POST /api/auth/login