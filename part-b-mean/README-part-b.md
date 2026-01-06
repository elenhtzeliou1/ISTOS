Παρατηρήσεις για αξιολογητή
Άνοιξτε πρώτα τον server (npm run dev στο server).
Μετά τρέτξε τον client (npm run dev στο client).
Αν δεν εμφανίζονται δεδομένα, έλεγξε ότι:
    - έγινε seed (npm run seed:all)
    - το MongoDB URI είναι σωστό στο server/.env


------------------------------------------------------------------------------------------------------

## `README-part-b.md` (στο root του `part-b-mean/`)
# InfoHub — Part B (MEAN Client–Server)

Στόχος του Part B είναι η μετάβαση από στατικό frontend (Part A) σε πλήρη client–server εφαρμογή:
- **MongoDB (mongoose)** : αποθήκευση δεδομένων (users, courses, books, videos, categories, enrollments, reviews)
- **Express/Node.js**: REST API
- **Angular + Vite**: η client εφαρμογή που αντλεί δεδομένα από το API

## Δομή φακέλων project
- `server/` → Node/Express API + MongoDB (Mongoose)
- `client/` → Angular (standalone components) + Vite dev server

## Για γρήγορη εκκίνηση, ακολουθήστε τα παρακάτω βήματα:

### 1) Server
```bash
cd server
npm install
cp .env.example .env   # συμπληρώστε το .env με τα κατάλληλα στοιχεία -> δείτε .env.example
npm run seed:all
npm run dev

Ο server τρέχει στο URL: http://localhost:5000


### 2)  Client
cd client
npm install
npm run dev

Ο Client τρέχει στο URL: http://localhost:5173

Ροή δεδομένων (Data flow)

Ο client ζητά δεδομένα (π.χ. Courses/Books/Videos/Categories) μέσω GET /api/...

Ο server απαντά με JSON από MongoDB (Mongoose models)
Για actions χρήστη:
    - Register: POST /api/users
    - Login: POST /api/auth/login (επιστρέφει JWT)
    - Enroll: POST /api/enrollments (απαιτεί JWT)
    - Review: PUT /api/reviews/course/:courseId (απαιτεί JWT + enrolled)

Ο client χρησιμοποιεί proxy του Vite ώστε να καλεί /api/* χωρίς hardcoded backend URL.

Η λειτουργικότητα που υλοποιήθηκε: 

    - Δυναμική φόρτωση λιστών (courses, books, videos, categories) από MongoDB μέσω REST API

    - Προτεινόμενο περιεχόμενο (proposed endpoints για courses/books/videos)

    - Εγγραφή χρήστη (register) + login (JWT)

    - Προφίλ χρήστη (GET/PUT /me)

    - Enrollment σε course (JWT protected)

    - Reviews ανά course (public read + protected write/update)

Endpoints (Σύνοψη)

Auth: POST /api/auth/login

Users: POST /api/users, GET /api/users/check, GET/PUT /api/users/me

Categories: 
GET /api/categories, 
GET /api/categories/:id

Courses: 
GET /api/courses, 
GET /api/courses/proposed, ή και GET /api/courses/proposed?limit=4
GET /api/courses/:id

Books:
GET /api/books, 
GET /api/books/proposed, 
GET /api/books/by-book-id/:bookId, 
GET /api/books/:id

Videos: 
GET /api/videos, 
GET /api/videos/proposed, 
GET /api/videos/:id
GET /api/videos/by-ids?ids=1 


Users: 
Register: 
POST /api/users, 
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


Login:
POST /api/auth/login
BODY: {
  "email": "johnDoe@gmail.com",
  "password": "123456e"
}
save the token, will be need it for next endpoints

GET /api/users/me

Enrollments: 
Create an enrollment:
Body {
    "course" : "694b365abc0529f3daed8b9f"
    }
POST /api/enrollments, 

Get all the enrollments for the user that is logged in:
GET /api/enrollments/me/enrollments

Reviews: 
GET /api/reviews/course/:courseId, 

Create a review (needs to be enrolled to the course that you want to leave a review):
body {
   "rating": 4,
    "comment": "I find the course very helpful—well done!"
}
PUT /api/reviews/course/:courseId

Get your reviews: 
GET /api/reviews/course/:courseId/me, 
--------------------------------------------

Ρυθμίσεις Περιβάλλοντος

Ο server χρησιμοποιεί:

MONGODB_URI

PORT

JWT_SECRET

JWT_EXPIRES_IN

Δες: server/.env.example