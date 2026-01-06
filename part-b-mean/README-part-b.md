Παρατηρήσεις για αξιολογητή
Άνοιξτε πρώτα τον server (npm run dev στο server).
Μετά τρέτξε τον client (npm run dev στο client).
Αν δεν εμφανίζονται δεδομένα, έλεγξε ότι:
    -έγινε seed (npm run seed:all)
    -το MongoDB URI είναι σωστό στο server/.env


------------------------------------------------------------------------------------------------------

## `README-part-b.md` (στο root του `part-b-mean/`)
# InfoHub — Part B (MEAN Client–Server)

Στόχος του Part B είναι η μετάβαση από στατικό frontend (Part A) σε πλήρη client–server εφαρμογή:
- Backend με Node.js + Express
- MongoDB για αποθήκευση δεδομένων (Mongoose)
- Client σε Angular που αντλεί δεδομένα μέσω REST API
- Επικοινωνία Client ↔ Server μέσω endpoints `/api/...`

------------------------------------------------------------------------------------------------------

## Δομή Project
- `server/` : Express API + MongoDB models + routes/controllers + seed scripts
- `client/` : Angular app με pages + components + services (ApiService/AuthService)

------------------------------------------------------------------------------------------------------

## Γρήγορη Εκκίνηση 

### Server
```bash
cd server
npm install
# δημιουργία server/.env (δες .env.example)
npm run seed:all
npm run dev


Server URL: http://localhost:5000

Client
cd client
npm install
npm run dev

Client URL: http://localhost:5173

Ροή Δεδομένων (Data Flow)

Ο client φορτώνει σελίδες (Courses/Books/Videos/Categories).

Τα δεδομένα έρχονται από REST endpoints (π.χ. GET /api/courses).

Το Angular ApiService κάνει HTTP calls προς /api/....

Το Vite proxy προωθεί αυτά τα calls στον backend server (localhost:5000).

Το backend κάνει queries στη MongoDB και επιστρέφει JSON στον client.

Η λειτουργικότητα που υλοποιήθηκε

Προβολή λιστών: Categories / Courses / Books / Videos από MongoDB

Προτεινόμενα (proposed) endpoints για home sections / carousels

Register χρήστη (POST /api/users) με βασικούς ελέγχους (π.χ. ηλικία, password length)

Login (POST /api/auth/login) με JWT

Protected endpoints:

GET/PUT /api/users/me

Enroll σε course (POST /api/enrollments)

Reviews (read public, write μόνο για enrolled + logged in)

Endpoints (Σύνοψη)

/api/categories (GET)

/api/courses (GET, GET by id, GET proposed)

/api/books (GET, GET by id, GET by bookId, GET proposed, GET by ids)

/api/videos (GET, GET by id, GET proposed, GET by ids)

/api/users (POST register, GET check, GET/PUT me)

/api/auth/login (POST)

/api/enrollments (POST enroll, GET my enrollments)

/api/reviews/course/:courseId (GET public, GET/PUT “my review” protected)

Ρυθμίσεις Περιβάλλοντος

Ο server χρησιμοποιεί:

MONGODB_URI

PORT

JWT_SECRET

JWT_EXPIRES_IN

Δες: server/.env.example