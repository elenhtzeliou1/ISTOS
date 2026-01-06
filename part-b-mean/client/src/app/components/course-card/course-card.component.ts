import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../services/api.service';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCardComponent {
  @Input({ required: true }) course!: Course;

  
  get category(): string {
    return String(this.course.category || '').trim();
  }

  get difficulty(): string {
    return String(this.course.difficulty || 'All levels').trim();
  }

  get availabilityLabel(): string {
    return this.course.available ? 'Available' : 'Unavailable';
  }
}