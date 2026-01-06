import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoryLabelList {
  label: string;
}
export interface CategoryInfoList {
  info: string;
}
export type Lesson = {
  id: string;
  title: string;
  summary?: string;
  minutes: number;
};

export type CourseSection = {
  id?: string;
  title?: string;
  summary?: string;
  lessons?: Lesson[];
};

export type LearningGoal = {
  title: string;
  text: string;
};

export interface Course {
  _id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;

  available?: boolean;
  featured?: boolean;

  cover?: string;
  learningGoals?: { title: string; text: string }[];
  sections?: { id?: string; title?: string; summary?: string; lessons?: Lesson[] }[];
  questions?: { question: string; answer: string }[];
  recommended?: any;
}

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

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('/api/courses');
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`/api/courses/${id}`);
  }
  //get proposed courses from backedn
  getProposedCourses(limit = 5) {
    return this.http.get<Course[]>(`/api/courses/proposed?limit=${limit}`);
  }

  getBooksByIds(ids: number[]) {
    const q = encodeURIComponent(ids.join(','));
    return this.http.get<Book[]>(`/api/books/by-ids?ids=${q}`);
  }
  getVideosByIds(ids: number[]) {
    const q = encodeURIComponent(ids.join(','));
    return this.http.get<Video[]>(`/api/videos/by-ids?ids=${q}`);
  }
  //----------------------------------------------------//

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>('/api/books');
  }
  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`/api/books/${id}`);
  }
  getProposedBooks(limit = 4) {
    return this.http.get<Book[]>(`/api/books/proposed?limit=${limit}`);
  }
  getBookByBookId(bookId: number) {
    return this.http.get<Book>(`/api/books/by-book-id/${bookId}`);
  }
  //----------------------------------------------------//
  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>('/api/videos');
  }
  getVideoById(id: string): Observable<Video> {
    return this.http.get<Video>(`/api/videos/${id}`);
  }
  getProposedVideos(limit = 3) {
    return this.http.get<Video[]>(`/api/videos/proposed?limit=${limit}`);
  }
  //----------------------------------------------------//
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }
  getCategoryBySlug(slug: string) {
    return this.http.get<Category>(`/api/categories/slug/${encodeURIComponent(slug)}`);
  }
  //----------------------------------------------------//
  getCourseReviews(courseId: string) {
    return this.http.get<any[]>(`/api/reviews/course/${courseId}`);
  }

  getMyReview(courseId: string) {
    return this.http.get<any | null>(`/api/reviews/course/${courseId}/me`);
  }

  upsertMyReview(courseId: string, body: { rating: number; comment: string }) {
    return this.http.put<any>(`/api/reviews/course/${courseId}`, body);
  }
  //----------------------------------------------------//

  registerUser(body: any) {
    return this.http.post('/api/users', body);
  }
  getMe() {
    return this.http.get<any>('/api/users/me');
  }

  updateMe(body: any) {
    return this.http.put<any>('/api/users/me', body);
  }

  getMyEnrollments() {
    return this.http.get<any[]>('/api/enrollments/me/enrollments');
  }
  //----------------------------------------------------//

  enroll(courseId: string) {
    return this.http.post('/api/enrollments', { course: courseId });
  }
  review(body: { user: string; course: string; rating: number; comment?: string }) {
    return this.http.post('/api/reviews', body);
  }

  login(body: { email: string; password: string }) {
    return this.http.post<{ token: string; user: any }>('/api/auth/login', body);
  }
  checkUserAvailability(email: string, userName: string) {
    return this.http.get('/api/users/check', {
      params: {
        email: (email || '').trim(),
        userName: (userName || '').trim(),
      },
    });
  }
}
