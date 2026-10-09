import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ResourceItem, Scheme } from '../models';

@Component({
  selector: 'app-resources-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-header">
      <h1>Government resources</h1>
      <p>Useful portals and information sources for scholarships, jobs, education, health, and help services.</p>
    </section>

    <div class="toolbar" *ngIf="relatedSchemes.length">
      <span>Browse related schemes:</span>
      <a *ngFor="let scheme of relatedSchemes" [routerLink]="['/schemes', scheme.id]" class="chip secondary-tag">
        {{ scheme.name }}
      </a>
    </div>

    <div class="resource-grid">
      <article class="resource-card" *ngFor="let resource of resources">
        <h3>{{ resource.name }}</h3>
        <p>{{ resource.description }}</p>
        <span>{{ resource.category }}</span>
        <a [href]="resource.officialUrl" target="_blank" class="primary-btn compact">Official URL</a>
      </article>
    </div>
  `,
  styles: ['']
})
export class ResourcesPageComponent implements OnInit {
  resources: ResourceItem[] = [];
  relatedSchemes: Scheme[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const localResources = this.readLocalResources();
    const localSchemes = this.readLocalSchemes();

    this.resources = localResources;
    this.relatedSchemes = localSchemes.slice(0, 4);

    this.apiService.getResources().subscribe((resources) => {
      this.resources = resources;
    });

    this.apiService.getSchemes().subscribe((schemes) => {
      this.relatedSchemes = schemes.slice(0, 4);
    });
  }

  private readLocalResources(): ResourceItem[] {
    try {
      const raw = localStorage.getItem('jansahayak.resources');
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) && parsed.length ? parsed : this.apiService.fallbackResources;
    } catch {
      return this.apiService.fallbackResources;
    }
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
}
