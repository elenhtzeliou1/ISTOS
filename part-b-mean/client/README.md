
## `client/README-client.md`

```md
# InfoHub Frontend (Client) — Part B

Frontend της πλατφόρμας e-learning, φτιαγμένο με Angular (standalone components) και Vite.
Τα δεδομένα (courses/books/videos/categories/users) **δεν είναι hardcoded** — έρχονται από το backend REST API.

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

Εκκίνηση dev server (Vite)
npm run dev


Σύνδεση Client → Server (Proxy)
Ο client χρησιμοποιεί relative URLs τύπου /api/....
Στο vite.config.ts υπάρχει proxy:
/api → http://localhost:5000
Άρα όταν ο client κάνει:
GET /api/courses  στην πραγματικότητα πηγαίνει στον backend server.
