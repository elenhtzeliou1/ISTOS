import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Video } from '../../services/api.service';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './video-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCardComponent {
  @Input({ required: true }) video!: Video;

  get availabilityLabel(): string {
    return this.video.available ? 'Available' : 'Unavailable';
  }

  sliceWords(text: string, maxWords = 26): string {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return words.join(' ');
    return words.slice(0, maxWords).join(' ') + '…';
  }
}
