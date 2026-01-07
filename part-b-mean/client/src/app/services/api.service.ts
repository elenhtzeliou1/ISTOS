import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Category label/info list types.
 * Backend returns arrays like:
 * - label_list: [{ label: "..." }, ...]
 * - info_list:  [{ info: "..." }, ...]
 */
export interface CategoryLabelList {
  label: string;
}
export interface CategoryInfoList {
  info: string;
}

/**
 * Course lesson model used by the UI (and stored in Course.sections).
 */
export type Lesson = {
  id: string;
  title: string;
  summary?: string;
  minutes: number;
};

/**
 * Course section model (groups lessons).
 */
export type CourseSection = {
  id?: string;
  title?: string;
  summary?: string;
  lessons?: Lesson[];
};

/**
 * Learning goal displayed on course details page.
 */
export type LearningGoal = {
  title: string;
  text: string;
};

/**
 * Main Course model returned from backend.
 * Note: some fields are optional because seed data / backend response can vary.
 */
export interface Course {
  _id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;

  // Optional flags used in filtering/recommendations
  available?: boolean;
  featured?: boolean;

  // Optional media + nested content
  cover?: string;
  learningGoals?: { title: string; text: string }[];
  sections?: { id?: string; title?: string; summary?: string; lessons?: Lesson[] }[];
  questions?: { question: string; answer: string }[];

  /**
   * Recommended content stored in course:
   * typically contains ids + reason text (books/videos).
   */
  recommended?: any;
}

/**
 * Book model returned from backend.
 * bookId is a legacy/external numeric id used by recommendations.
 */
export interface Book {
  bookId: number;
  _id: string;
  title: string;
  author: string;
  category: string;
  difficulty: string;
  available: boolean;
  featured?: boolean;
  description: string;
  cover?: string;
}

/**
 * Video model returned from backend.
 * youtubeUrl is used to build a safe embed URL.
 */
export interface Video {
  _id: string;
  title: string;
  category: string;
  featured?: boolean;
  difficulty: string;
  description: string;
  cover?: string;
  available: boolean;
  youtubeUrl: string;
}

/**
 * Category model returned from backend.
 * legacyId/id may exist for compatibility with earlier dataset structure.
 */
export interface Category {
  _id: string;
  id?: number;
  legacyId?: number;
  title: string;
  slug: string;
  description: string;
  label_list: CategoryLabelList[];
  info_list: CategoryInfoList[];
  cover?: string;
}

/**
 * API service:
 * A single place that defines all HTTP requests to the backend REST API.
 *
 * Important:
 * - Uses relative URLs (/api/...) so Vite proxy can forward to the backend.
 * - Auth headers are NOT set here; typically handled via an HttpInterceptor.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // ----------------------------------------------------
  // Courses
  // ----------------------------------------------------

  /**
   * GET /api/courses
   * Returns the full list of courses.
   */
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('/api/courses');
  }

  /**
   * GET /api/courses/:id
   * Returns a single course by MongoDB _id.
   */
  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`/api/courses/${id}`);
  }

  /**
   * GET /api/courses/proposed?limit=5
   * Returns proposed/recommended courses.
   */
  getProposedCourses(limit = 5) {
    return this.http.get<Course[]>(`/api/courses/proposed?limit=${limit}`);
  }

  // ----------------------------------------------------
  // Books (including legacy "bookId" helpers)
  // ----------------------------------------------------

  /**
   * GET /api/books/by-ids?ids=1,2,3
   * Used by course recommendations where books are referenced by numeric bookId.
   */
  getBooksByIds(ids: number[]) {
    const q = encodeURIComponent(ids.join(','));
    return this.http.get<Book[]>(`/api/books/by-ids?ids=${q}`);
  }

  /**
   * GET /api/books
   * Returns the full list of books.
   */
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>('/api/books');
  }

  /**
   * GET /api/books/:id
   * Returns a single book by MongoDB _id.
   */
  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`/api/books/${id}`);
  }

  /**
   * GET /api/books/proposed?limit=4
   * Returns proposed/recommended books.
   */
  getProposedBooks(limit = 4) {
    return this.http.get<Book[]>(`/api/books/proposed?limit=${limit}`);
  }

  /**
   * GET /api/books/by-book-id/:bookId
   * Returns a book by its legacy/external numeric bookId.
   */
  getBookByBookId(bookId: number) {
    return this.http.get<Book>(`/api/books/by-book-id/${bookId}`);
  }

  // ----------------------------------------------------
  // Videos (including legacy "videoId" helpers)
  // ----------------------------------------------------

  /**
   * GET /api/videos/by-ids?ids=1,2,3
   * Used by course recommendations where videos are referenced by numeric videoId.
   */
  getVideosByIds(ids: number[]) {
    const q = encodeURIComponent(ids.join(','));
    return this.http.get<Video[]>(`/api/videos/by-ids?ids=${q}`);
  }

  /**
   * GET /api/videos
   * Returns the full list of videos.
   */
  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>('/api/videos');
  }

  /**
   * GET /api/videos/:id
   * Returns a single video by MongoDB _id.
   */
  getVideoById(id: string): Observable<Video> {
    return this.http.get<Video>(`/api/videos/${id}`);
  }

  /**
   * GET /api/videos/proposed?limit=3
   * Returns proposed/recommended videos.
   */
  getProposedVideos(limit = 3) {
    return this.http.get<Video[]>(`/api/videos/proposed?limit=${limit}`);
  }

  // ----------------------------------------------------
  // Categories
  // ----------------------------------------------------

  /**
   * GET /api/categories
   * Returns the full list of categories.
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }

  /**
   * GET /api/categories/slug/:slug
   * Returns a single category by slug.
   */
  getCategoryBySlug(slug: string) {
    return this.http.get<Category>(`/api/categories/slug/${encodeURIComponent(slug)}`);
  }

  // ----------------------------------------------------
  // Reviews
  // ----------------------------------------------------

  /**
   * GET /api/reviews/course/:courseId
   * Public endpoint: returns all reviews for a course.
   */
  getCourseReviews(courseId: string) {
    return this.http.get<any[]>(`/api/reviews/course/${courseId}`);
  }

  /**
   * GET /api/reviews/course/:courseId/me
   * Protected endpoint:
   * - requires JWT
   * - requires enrollment in that course
   * Returns logged-in user's review or null.
   */
  getMyReview(courseId: string) {
    return this.http.get<any | null>(`/api/reviews/course/${courseId}/me`);
  }

  /**
   * PUT /api/reviews/course/:courseId
   * Protected endpoint:
   * - requires JWT
   * - requires enrollment
   * Creates or updates the logged-in user's review.
   */
  upsertMyReview(courseId: string, body: { rating: number; comment: string }) {
    return this.http.put<any>(`/api/reviews/course/${courseId}`, body);
  }

  // ----------------------------------------------------
  // Users / Profile
  // ----------------------------------------------------

  /**
   * POST /api/users
   * Registers a new user (does NOT return a token).
   */
  registerUser(body: any) {
    return this.http.post('/api/users', body);
  }

  /**
   * GET /api/users/me
   * Protected endpoint: returns logged-in user's profile.
   */
  getMe() {
    return this.http.get<any>('/api/users/me');
  }

  /**
   * PUT /api/users/me
   * Protected endpoint: updates logged-in user's profile.
   */
  updateMe(body: any) {
    return this.http.put<any>('/api/users/me', body);
  }

  // ----------------------------------------------------
  // Enrollments
  // ----------------------------------------------------

  /**
   * GET /api/enrollments/me/enrollments
   * Protected endpoint: returns the logged-in user's enrollments.
   */
  getMyEnrollments() {
    return this.http.get<any[]>('/api/enrollments/me/enrollments');
  }

  /**
   * POST /api/enrollments
   * Protected endpoint: enroll logged-in user to a course.
   * Body: { course: "<courseId>" }
   */
  enroll(courseId: string) {
    return this.http.post('/api/enrollments', { course: courseId });
  }

  // ----------------------------------------------------
  // Auth
  // ----------------------------------------------------

  /**
   * POST /api/auth/login
   * Authenticates user and returns:
   * - token (JWT)
   * - user object
   */
  login(body: { email: string; password: string }) {
    return this.http.post<{ token: string; user: any }>('/api/auth/login', body);
  }

  /**
   * GET /api/users/check?email=...&userName=...
   * Availability check for register form.
   * Backend returns 409 if taken, 200 if available.
   */
  checkUserAvailability(email: string, userName: string) {
    return this.http.get('/api/users/check', {
      params: {
        email: (email || '').trim(),
        userName: (userName || '').trim(),
      },
    });
  }

  // ----------------------------------------------------
  // NOTE:
  // The following method is older endpoint and may not be used.
  // current review flow uses PUT /api/reviews/course/:courseId (upsert).
  // ----------------------------------------------------
  review(body: { user: string; course: string; rating: number; comment?: string }) {
    return this.http.post('/api/reviews', body);
  }
}
