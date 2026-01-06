import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-sidebar.component.html',
})
export class FilterSidebarComponent {
  @Input() label = 'Items';
  @Input() count = 0;

  isOpen = false;
  isCollapsed = false;

  open(): void {
    this.isOpen = true;
    document.body.classList.add('no-scroll');
  }

  close(): void {
    this.isOpen = false;
    document.body.classList.remove('no-scroll');
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') this.close();
  }
}
