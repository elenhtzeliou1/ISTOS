import { Routes } from '@angular/router';

// Pages / route components
import { HomeComponent } from './pages/home/home.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CourseDetailsComponent } from './pages/course-details/course-details.components';
import { Register } from './pages/register/register';
import { Books } from './pages/books/books';
import { BookDetails } from './pages/book-details/book-details';
import { Videos } from './pages/videos/videos';
import { VideoDetails } from './pages/video-details/video-details';
import { Team } from './pages/team/team';

/**
 * Application routes configuration.
 *
 * Notes:
 * - This is a standalone Angular setup (no NgModule routing module).
 * - Routes map URL paths to the corresponding page component.
 * - Some routes include dynamic parameters (e.g. :id).
 * - A wildcard route at the bottom handles unknown URLs.
 */
export const routes: Routes = [
  /**
   * Home page
   * URL: /
   */
  { path: '', component: HomeComponent },

  /**
   * Courses list page
   * URL: /courses
   */
  { path: 'courses', component: CoursesComponent },

  /**
   * Course details page
   * URL: /course-details/<id>
   * :id is typically a MongoDB _id string.
   */
  { path: 'course-details/:id', component: CourseDetailsComponent },

  /**
   * Register page (also used as Profile page when logged in)
   * URL: /register
   */
  { path: 'register', component: Register },

  /**
   * Categories page
   * URL: /categories
   */
  { path: 'categories', component: CategoriesComponent },

  /**
   * Books list page
   * URL: /books
   */
  { path: 'books', component: Books },

  /**
   * Book details page
   * URL: /book-details/<id>
   * :id can be either:
   * - MongoDB _id (string)
   * - or numeric legacy bookId (depending on your BookDetails logic)
   */
  { path: 'book-details/:id', component: BookDetails },

  /**
   * Videos list page
   * URL: /videos
   */
  { path: 'videos', component: Videos },

  /**
   * Video details page
   * URL: /video-details/<id>
   * :id is typically a MongoDB _id string.
   */
  { path: 'video-details/:id', component: VideoDetails },

  /**
   * Team/About page
   * URL: /team
   */
  { path: 'team', component: Team },

  /**
   * Login page (lazy-loaded)
   * URL: /login
   *
   * Using loadComponent keeps initial bundle smaller by loading the login
   * component only when this route is visited.
   */
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },

  /**
   * Wildcard route:
   * Any unknown path redirects to home.
   * Must be the LAST route.
   */
  { path: '**', redirectTo: '' },
];
