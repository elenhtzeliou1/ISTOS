# InfoHub Server (Part B - MEAN)

Backend για την πλατφόρμα InfoHub (Node.js + Express + MongoDB).
Ο server παρέχει REST API που χρησιμοποιείται από τον client.

## Requirements
- Node.js / npm
- MongoDB (local) ή MongoDB Atlas

---

## Εγκατάσταση & Εκκίνηση
```bash
cd part-b-mean/server


ΟΔΗΓΙΕΣ: 
Ρύθμιση περιβάλλοντος: 
Αντιγράψτε το .env.example σε .env
Συμπληρώστε MONGODB_URI, PORT, JWT_SECRET

Στη συνέχεια: 
npm install
npm run seed:all

Για την εκκίνηση του Server:
    -Development (nodemon):
        npm run dev

    ή
    
    -Production mode:
        npm start 

Ο server τρέχει στο http://localhost:5000

#######################################################
#######################################################

Βασικά REST API Endpoints

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
GET /api/reviews/course/:courseId (public)
GET /api/reviews/course/:courseId/me (auth + enrolled required)
PUT /api/reviews/course/:courseId (auth + enrolled required)
Δημιουργεί ή ενημερώνει review του logged-in χρήστη.

Protected (μόνο αν logged in + enrolled στο course):
GET /api/reviews/course/:courseId/me
PUT /api/reviews/course/:courseId body: { "rating": number, "comment": string }

Authentication
Στα protected endpoints στέλνεις header:
Authorization: Bearer <token>

Το token λαμβάνεται από:
POST /api/auth/login

Για έλεγχο με Postman:
Do: npm run seed:all
Run the server: npm run dev
try: 
GET http://localhost:5000/api/courses
GET http://localhost:5000/api/books/proposed
GET http://localhost:5000/api/videos