import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

import {CategoriesComponent} from './pages/categories/categories.component';
import {CoursesComponent} from './pages/courses/courses.component';
import {Register} from './pages/register/register';
import {Books} from './pages/books/books';
import { BookDetails } from './pages/book-details/book-details';
import {Videos} from './pages/videos/videos';
import { VideoDetails } from './pages/video-details/video-details';

import {Team} from './pages/team/team';

import { CourseDetailsComponent } from './pages/course-details/course-details.components';



export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'courses', component: CoursesComponent },

  { path: 'course-details/:id', component: CourseDetailsComponent }, 

  { path: 'register', component: Register },
  { path: 'categories', component: CategoriesComponent },
  { path: 'books', component: Books },
  { path: 'book-details/:id', component: BookDetails },
  { path: 'videos', component: Videos },
  {path:'video-details/:id', component:VideoDetails},
  { path: 'team', component: Team },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },


  { path: '**', redirectTo: '' },

];