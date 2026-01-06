
## `client/README-client.md`

```md
# InfoHub Frontend (Client) — Part B

Frontend της πλατφόρμας e-learning, φτιαγμένο με Angular (standalone components) και Vite.
Τα δεδομένα (courses/books/videos/categories/users) **δεν είναι hardcoded** — έρχονται από το backend REST API.

Αντί για fetch() έχει χρησιμοποιηθεί Angular http client

Στον φακελο /components/ υπάρχουν πλέον τα:  navbar,footer,book-card, course-card, video-card, filter-sidebar, στοιχεία που επαναχρησιμοποιούνται στην σελίδα και το summary modal που χρησιμοποιείται στο register page.

Έχει δημιουργηθεί και σελίδα Login

---

## Προαπαιτούμενα
- Node.js / npm
- Ο server να τρέχει στο `http://localhost:5000`

---

## Εγκατάσταση & Εκκίνηση

### 1) Install dependencies
```bash
cd client
npm install

Εκκίνηση dev server (Vite) με: 
npm run dev

Ο client τρέχει συνήθως στο:
http://localhost:5173

Σύνδεση Client -> Server (Proxy)
Ο client χρησιμοποιεί relative URLs τύπου /api/....

Στο vite.config.ts έχει proxy:
/api → http://localhost:5000
Όλα τα requests που ξεκινάνε με /api προωθούνται σε http:localhost:5000
Άρα όταν ο client κάνει:
GET /api/courses  στην πραγματικότητα πηγαίνει στον backend server.

Συνεπως ο client καλεί endpoints όπως:

    - /api/courses

    - /api/books

    - /api/videos

χωρίς να γράφει hardcoded backend URL.

Αν δεν φορτώνουν τα δεδομένα βεβαιωθείται πως έχετε εκινήσει τον server.