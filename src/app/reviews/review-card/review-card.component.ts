import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Review } from '../models';

@Component({
    selector: 'app-review-card',
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatChipsModule,
        MatDividerModule,
        MatTooltipModule
    ],
    templateUrl: './review-card.component.html',
    styleUrls: ['./review-card.component.scss']
})
export class ReviewCardComponent {
  @Input() review!: Review;
  @Input() showJobTitle = false;
  @Input() canEdit = false;
  @Output() helpful = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  userHasVoted = false;

  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  getStarIcon(position: number): string {
    return position <= this.review.rating ? 'star' : 'star_border';
  }

  getRatingColor(): string {
    if (this.review.rating >= 4) return 'primary';
    if (this.review.rating >= 3) return 'accent';
    return 'warn';
  }

  markHelpful(helpful: boolean): void {
    if (!this.userHasVoted) {
      this.userHasVoted = true;
      this.helpful.emit(helpful);
    }
  }

  getTimeAgo(): string {
    const now = new Date();
    const createdAt = new Date(this.review.createdAt);
    const diffInMs = now.getTime() - createdAt.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  }

  onEdit(): void {
    this.edit.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }
}
