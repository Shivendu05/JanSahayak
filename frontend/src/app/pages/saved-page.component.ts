import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Scheme } from '../models';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-saved-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-header">
      <h1>Saved schemes</h1>
      <p>Your bookmarked welfare schemes and support programs.</p>
    </section>

    <div class="scheme-grid" *ngIf="savedSchemes.length; else emptyState">
      <article class="scheme-card" *ngFor="let scheme of savedSchemes">
        <span class="chip">{{ scheme.category }}</span>
        <h3>{{ scheme.name }}</h3>
        <p>{{ scheme.description }}</p>
        <div class="card-actions">
          <a [routerLink]="['/schemes', scheme.id]" class="primary-btn compact">View details</a>
          <button type="button" class="danger-btn compact" (click)="removeSavedScheme(scheme.id!)">Remove</button>
        </div>
      </article>
    </div>

    <ng-template #emptyState>
      <div class="empty-state">
        <p>No saved schemes yet. Explore and save the ones that matter to you.</p>
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      padding: 1.5rem 0 2.5rem;
    }

    .page-header {
      margin-bottom: 1.5rem;
    }

    .page-header h1 {
      margin: 0;
      font-size: clamp(2rem, 4vw, 3rem);
      color: #123a5f;
    }

    .page-header p {
      margin: 0.5rem 0 0;
      color: #4b5563;
      font-size: 1.02rem;
    }

    .scheme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.25rem;
    }

    .scheme-card {
      background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
      border: 1px solid #d7e6f8;
      border-radius: 18px;
      padding: 1.25rem;
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }

    .chip {
      display: inline-flex;
      width: fit-content;
      background: rgba(29, 78, 216, 0.1);
      color: #1d4ed8;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.38rem 0.7rem;
      border-radius: 999px;
    }

    .scheme-card h3 {
      margin: 0;
      font-size: 1.3rem;
      color: #0f172a;
    }

    .scheme-card p {
      margin: 0;
      color: #475569;
      line-height: 1.6;
      flex: 1;
    }

    .card-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.5rem;
    }

    .primary-btn,
    .danger-btn {
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }

    .primary-btn {
      background: linear-gradient(135deg, #1d4ed8, #2563eb);
      color: white;
      padding: 0.7rem 1rem;
      box-shadow: 0 6px 14px rgba(37, 99, 235, 0.18);
    }

    .danger-btn {
      background: #ef4444;
      color: white;
      padding: 0.7rem 0.9rem;
      box-shadow: 0 6px 14px rgba(239, 68, 68, 0.2);
    }

    .primary-btn:hover,
    .danger-btn:hover {
      transform: translateY(-1px);
    }

    .empty-state {
      background: rgba(148, 163, 184, 0.08);
      border: 1px dashed #cbd5e1;
      border-radius: 18px;
      padding: 2.25rem 1.25rem;
      text-align: center;
      color: #475569;
    }
  `]
})
export class SavedPageComponent implements OnInit {
  savedSchemes: Scheme[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.savedSchemes = [];
      return;
    }

    const session = JSON.parse(user);
    const localIds = this.readLocalSavedIds(Number(session.id));
    this.savedSchemes = this.readLocalSavedSchemes(localIds);

    this.apiService.getSavedSchemes(Number(session.id)).subscribe((schemes) => {
      this.savedSchemes = schemes.length ? schemes : this.readLocalSavedSchemes(localIds);
    });
  }

  removeSavedScheme(schemeId: number): void {
    const user = localStorage.getItem('user');
    if (!user) {
      return;
    }

    const session = JSON.parse(user);
    const userId = Number(session.id);
    const updatedSaved = this.savedSchemes.filter((scheme) => Number(scheme.id) !== schemeId);
    this.savedSchemes = updatedSaved;

    const localIds = this.readLocalSavedIds(userId).filter((id) => id !== schemeId);
    localStorage.setItem(`jansahayak.saved.${userId}`, JSON.stringify(localIds));

    this.apiService.removeSavedScheme(userId, schemeId).subscribe();
  }

  private readLocalSavedIds(userId: number): number[] {
    try {
      const raw = localStorage.getItem(`jansahayak.saved.${userId}`);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map((id) => Number(id)).filter((id) => !Number.isNaN(id)) : [];
    } catch {
      return [];
    }
  }

  private readLocalSavedSchemes(savedIds: number[]): Scheme[] {
    try {
      const raw = localStorage.getItem('jansahayak.schemes');
      const parsed = raw ? JSON.parse(raw) : [];
      const schemes = Array.isArray(parsed) ? parsed : [];
      return schemes.filter((scheme) => scheme && scheme.id !== undefined && savedIds.includes(Number(scheme.id)));
    } catch {
      return [];
    }
  }
}
