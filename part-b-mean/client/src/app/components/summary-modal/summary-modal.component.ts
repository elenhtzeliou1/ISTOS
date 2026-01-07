import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SummaryRow = { label: string; value: string };

@Component({
  selector: 'app-summary-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      id="summary-modal"
      class="modal-overlay"
      [class.active]="open"
      (click)="onBackdrop($event)"
    >
      <div class="modal-content">
        <span id="summary-close" class="modal-close" (click)="close.emit()">&times;</span>

        <h2>{{ title }}</h2>

        <div id="summary-content" class="modal-body">
          <ng-container *ngIf="rows?.length; else noRows">
            <ng-container *ngFor="let row of rows">
              <p><strong>{{ row.label }}: </strong>{{ row.value || '—' }}</p>
            </ng-container>
          </ng-container>

          <ng-template #noRows>
            <p>No data to review.</p>
          </ng-template>
        </div>

        <button id="final-submit" class="modal-enroll-btn" (click)="confirm.emit()">
          Confirm Registration
        </button>
      </div>
    </div>
  `,
})
export class SummaryModalComponent {
  @Input() open = false;
  @Input() title = 'Review Your Information';
  @Input() rows: SummaryRow[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement)?.id === 'summary-modal') {
      this.close.emit();
    }
  }
}
