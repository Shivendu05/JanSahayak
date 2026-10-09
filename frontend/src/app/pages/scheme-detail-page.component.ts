import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Scheme } from '../models';

@Component({
  selector: 'app-scheme-detail-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-header" *ngIf="scheme">
      <h1>{{ scheme.fullName || scheme.name }}</h1>
      <p>{{ scheme.description }}</p>
    </section>

    <div class="detail-card" *ngIf="scheme">
      <div class="detail-grid">
        <div><strong>Scheme:</strong> {{ scheme.name }}</div>
        <div><strong>Category:</strong> {{ scheme.category }}</div>
        <div><strong>Target group:</strong> {{ scheme.targetGroup }}</div>
        <div><strong>Level:</strong> {{ scheme.level || 'Government scheme' }}</div>
        <div><strong>Department:</strong> {{ scheme.department || 'Government department' }}</div>
        <div><strong>Deadline:</strong> {{ scheme.deadline || 'Check official portal' }}</div>
        <div><strong>Official website:</strong> <a [href]="scheme.officialWebsite" target="_blank">Open link</a></div>
        <div><strong>Verified:</strong> {{ scheme.lastVerified || 'Latest official update' }}</div>
      </div>

      <h3>Purpose</h3>
      <p>{{ scheme.purpose || scheme.description }}</p>

      <h3>Eligibility</h3>
      <p>{{ scheme.eligibility }}</p>

      <h3>Benefits</h3>
      <p>{{ scheme.benefits }}</p>

      <h3>Required documents</h3>
      <p>{{ scheme.requiredDocuments }}</p>

      <h3>Application process</h3>
      <p>{{ scheme.applicationProcess }}</p>

      <h3>Source</h3>
      <p>{{ scheme.source || 'Official government information' }}</p>

      <div class="detail-actions">
        <a [href]="scheme.officialApplicationUrl || scheme.officialWebsite" target="_blank" class="primary-btn">Apply / Official Website</a>
        <a *ngIf="scheme.videoUrl" [href]="scheme.videoUrl" target="_blank" class="secondary-btn">Watch guidance</a>
        <button type="button" class="secondary-btn" (click)="saveScheme()">Save scheme</button>
      </div>
    </div>
  `,
  styles: ['']
})
export class SchemeDetailPageComponent implements OnInit {
  scheme: Scheme | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    this.scheme = this.apiService.fallbackSchemes[0] ?? null;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const paramId = params.get('id');
      const schemeId = paramId ? Number(paramId) : NaN;

      if (!paramId || Number.isNaN(schemeId)) {
        this.scheme = this.apiService.fallbackSchemes[0] ?? null;
        return;
      }

      const matchedFallback = this.apiService.fallbackSchemes.find((item) => item.id === schemeId);
      this.scheme = matchedFallback ?? this.apiService.fallbackSchemes[0] ?? null;

      this.apiService.getSchemeById(schemeId).subscribe((scheme) => {
        const resolvedScheme = scheme ?? matchedFallback ?? this.apiService.fallbackSchemes[0] ?? null;
        this.scheme = resolvedScheme;
      });
    });
  }

  saveScheme(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please log in first.');
      return;
    }

    const session = JSON.parse(user);
    this.apiService.saveScheme(session.id, this.scheme!.id as number).subscribe(() => {
      alert('Scheme saved successfully.');
    });
  }
}
