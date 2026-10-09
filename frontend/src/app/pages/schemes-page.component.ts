import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Scheme } from '../models';

@Component({
  selector: 'app-schemes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="page-header">
      <h1>Government schemes</h1>
      <p>Explore support programs across education, health, employment, and more.</p>
    </section>

    <div class="toolbar">
      <input [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="Search schemes..." />
      <select [(ngModel)]="selectedCategory" (change)="applyFilters()">
        <option value="">All categories</option>
        <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
      </select>
      <select [(ngModel)]="selectedTargetGroup" (change)="applyFilters()">
        <option value="">All beneficiaries</option>
        <option *ngFor="let benefit of targetGroups" [value]="benefit">{{ benefit }}</option>
      </select>
      <select [(ngModel)]="sortBy" (change)="applyFilters()">
        <option value="name">Sort by name</option>
        <option value="category">Sort by category</option>
      </select>
    </div>

    <div class="scheme-grid">
      <article class="scheme-card" *ngFor="let scheme of filteredSchemes">
        <span class="chip">{{ scheme.category }}</span>
        <h3>{{ scheme.name }}</h3>
        <p>{{ scheme.description }}</p>
        <div class="meta-list">
          <span><strong>For:</strong> {{ scheme.targetGroup }}</span>
          <span *ngIf="scheme.level"><strong>Level:</strong> {{ scheme.level }}</span>
          <span *ngIf="scheme.lastVerified"><strong>Verified:</strong> {{ scheme.lastVerified }}</span>
        </div>
        <div class="card-actions" *ngIf="scheme.tags">
          <span class="chip secondary-tag" *ngFor="let tag of getTags(scheme.tags)">{{ tag }}</span>
        </div>
        <div class="card-actions">
          <a [routerLink]="['/schemes', scheme.id]" class="primary-btn compact">View details</a>
          <button type="button" class="secondary-btn compact" (click)="saveScheme(scheme.id!)">Save</button>
        </div>
      </article>
    </div>
  `,
  styles: [`
    .secondary-tag {
      background: rgba(15, 118, 110, 0.08);
      color: var(--primary-dark);
      margin-bottom: 0;
    }
  `]
})
export class SchemesPageComponent implements OnInit {
  allSchemes: Scheme[] = [];
  filteredSchemes: Scheme[] = [];
  categories = ['Education', 'Employment', 'Health', 'Women', 'Students', 'Farmers', 'Financial Assistance', 'Senior Citizens'];
  targetGroups: string[] = [];
  searchTerm = '';
  selectedCategory = '';
  selectedTargetGroup = '';
  sortBy = 'name';

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const localSchemes = this.readLocalSchemes();
    this.allSchemes = localSchemes;
    this.targetGroups = [...new Set(this.allSchemes.map((scheme) => scheme.targetGroup).filter(Boolean))];
    this.applyFilters();

    this.route.queryParamMap.subscribe((params) => {
      const category = params.get('category');
      this.selectedCategory = category ?? '';
      this.applyFilters();
    });

    this.apiService.getSchemes().subscribe((schemes) => {
      this.allSchemes = schemes;
      this.targetGroups = [...new Set(this.allSchemes.map((scheme) => scheme.targetGroup).filter(Boolean))];
      this.applyFilters();
    });
  }

  private readLocalSchemes(): Scheme[] {
    try {
      const raw = localStorage.getItem('jansahayak.schemes');
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) && parsed.length ? parsed : this.apiService.fallbackSchemes;
    } catch {
      return this.apiService.fallbackSchemes;
    }
  }

  applyFilters(): void {
    const normalizedCategory = (this.selectedCategory ?? '').trim();
    const normalizedTargetGroup = (this.selectedTargetGroup ?? '').trim();
    const normalizedSearchTerm = (this.searchTerm ?? '').trim();

    let result = [...this.allSchemes].filter((scheme) => !!scheme && !!scheme.name);

    if (normalizedCategory) {
      result = result.filter((scheme) => (scheme.category ?? '').toLowerCase() === normalizedCategory.toLowerCase());
    }

    if (normalizedTargetGroup) {
      result = result.filter((scheme) => (scheme.targetGroup ?? '').toLowerCase() === normalizedTargetGroup.toLowerCase());
    }

    if (normalizedSearchTerm) {
      const term = normalizedSearchTerm.toLowerCase();
      result = result.filter((scheme) =>
        (scheme.name ?? '').toLowerCase().includes(term) ||
        (scheme.description ?? '').toLowerCase().includes(term) ||
        (scheme.targetGroup ?? '').toLowerCase().includes(term)
      );
    }

    if (this.sortBy === 'name') {
      result.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
    } else {
      result.sort((a, b) => (a.category ?? '').localeCompare(b.category ?? ''));
    }

    this.filteredSchemes = result;
  }

  getTags(tags: string | null | undefined): string[] {
    return (tags ?? '').split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 3);
  }

  saveScheme(schemeId: number): void {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please log in to save schemes.');
      return;
    }

    const session = JSON.parse(user);
    this.apiService.saveScheme(session.id, schemeId).subscribe(() => {
      alert('Scheme saved successfully.');
    });
  }
}
