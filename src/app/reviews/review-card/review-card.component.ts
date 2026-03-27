import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
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
  standalone: true,
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
export class ReviewCardComponent implements OnDestroy {
  @Input() review!: Review;
  @Input() showJobTitle = false;
  @Input() canEdit = false;
  @Output() helpful = new EventEmitter<{ current: boolean | null; previous: boolean | null }>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  userVote: boolean | null = null;
  private committedVote: boolean | null = null;
  private debounceTimer: any = null;

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimer);
  }

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
    clearTimeout(this.debounceTimer);

    // Update local UI immediately (optimistic)
    if (this.userVote === helpful) {
      // Toggle off
      if (helpful) this.review.helpfulCount = Math.max(0, this.review.helpfulCount - 1);
      else this.review.notHelpfulCount = Math.max(0, this.review.notHelpfulCount - 1);
      this.userVote = null;
    } else {
      // Switch or new vote — undo previous first
      if (this.userVote !== null) {
        if (this.userVote) this.review.helpfulCount = Math.max(0, this.review.helpfulCount - 1);
        else this.review.notHelpfulCount = Math.max(0, this.review.notHelpfulCount - 1);
      }
      if (helpful) this.review.helpfulCount++;
      else this.review.notHelpfulCount++;
      this.userVote = helpful;
    }

    // Debounce the API call — fires 500ms after the last click
    this.debounceTimer = setTimeout(() => {
      if (this.userVote === this.committedVote) return; // no net change
      const previous = this.committedVote;
      this.committedVote = this.userVote;
      this.helpful.emit({ current: this.userVote, previous });
    }, 500);
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
