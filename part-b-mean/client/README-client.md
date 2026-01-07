# InfoHub Frontend (Client) — Part B

This repository contains the **frontend** of the InfoHub e-learning platform, built with **Angular (standalone components)** and **Vite**.

All data (courses, books, videos, categories, users, reviews, enrollments) is **fetched dynamically** from the backend **REST API** — nothing is hardcoded.

The Angular **HttpClient** is used instead of the native `fetch()` API.

---

## Project Structure

Inside the `/components` directory you will find reusable UI components such as:

- `navbar`
- `footer`
- `book-card`
- `course-card`
- `video-card`
- `filter-sidebar`
- Shared UI elements used across pages
- `summary-modal` (used on the Register page)

A dedicated **Login page** has also been implemented.

---

## Prerequisites

- Node.js / npm
- Backend server running at: http://localhost:5000

---

## Installation & Running the Client

### 1) Install dependencies
```bash
cd part-b-mean/client
npm install
```

---

### 2) Start Development Server (Vite)
```bash
npm run dev
```

The client usually runs at:
http://localhost:5173

---

Client <-> Server Connection (Vite Proxy)
The client uses relative API URLs (e.g. /api/...) instead of hardcoded backend URLs.


In vite.config.ts, a proxy is configured as follows:
```bash
/api → http://localhost:5000
```
Example
When the client makes a request such as:
```bash
GET /api/courses
```
It is internally forwarded to:

```bash
http://localhost:5000/api/courses
```

This allows the frontend to call endpoints like:
 - /api/courses
 - /api/books
 - /api/videos

 ---

## Troubleshooting
If data does not load correctly, make sure that:

The backend server is running

The server is available at http://localhost:5000

The Vite dev server is running (npm run dev)