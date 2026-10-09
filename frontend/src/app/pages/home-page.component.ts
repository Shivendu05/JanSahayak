import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ResourceItem, Scheme, Video } from '../models';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero">
      <div class="hero-content">
        <span class="badge">Trusted government information</span>
        <h1>Find the right welfare support for your needs.</h1>
        <p>
          Jan Sahayak helps citizens discover useful central and state welfare schemes, education
          support, healthcare benefits, and important official resources in one easy-to-use portal.
        </p>
        <div class="hero-actions">
          <a routerLink="/schemes" class="primary-btn">Explore schemes</a>
          <a routerLink="/resources" class="secondary-btn">Government resources</a>
        </div>
        <div class="stats-row">
          <div *ngFor="let stat of stats">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </div>
      </div>
      <div class="hero-panel">
        <div class="mini-card" *ngFor="let highlight of highlights; let i = index" [class.accent]="i === 1">
          <span>{{ highlight.label }}</span>
          <h3>{{ highlight.title }}</h3>
          <p>{{ highlight.description }}</p>
        </div>
      </div>
    </section>

    <section class="section-block">
      <div class="section-header">
        <h2>Popular welfare schemes</h2>
        <a routerLink="/schemes">View all</a>
      </div>
      <div class="scheme-grid">
        <article class="scheme-card" *ngFor="let scheme of popularSchemes">
          <span class="chip">{{ scheme.category }}</span>
          <h3>{{ scheme.name }}</h3>
          <p>{{ scheme.description }}</p>
          <div class="card-actions">
            <a [routerLink]="['/schemes', scheme.id]" class="primary-btn compact">View details</a>
          </div>
        </article>
      </div>
    </section>

    <section class="section-block">
      <div class="section-header">
        <h2>Categories</h2>
      </div>
      <div class="category-grid">
        <a
          class="category-item"
          *ngFor="let category of categories"
          [routerLink]="['/schemes']"
          [queryParams]="{ category: category }"
        >
          <span>{{ category }}</span>
        </a>
      </div>
    </section>

    <section class="section-block">
      <div class="section-header">
        <h2>How it works</h2>
      </div>
      <div class="steps-grid">
        <div class="step-card" *ngFor="let step of steps; let i = index">
          <div class="step-number">{{ i + 1 }}</div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </div>
      </div>
    </section>

    <section class="section-block">
      <div class="section-header">
        <h2>Useful videos</h2>
        <a routerLink="/videos">View all</a>
      </div>
      <div class="video-grid">
        <article class="video-card" *ngFor="let video of videos">
          <span class="chip">{{ video.category }}</span>
          <h3>{{ video.title }}</h3>
          <p>{{ video.description }}</p>
          <a [href]="video.youtubeUrl" target="_blank" class="link-btn">Open video</a>
        </article>
      </div>
    </section>

    <section class="section-block">
      <div class="section-header">
        <h2>Useful government resources</h2>
        <a routerLink="/resources">View all</a>
      </div>
      <div class="resource-grid">
        <article class="resource-card" *ngFor="let resource of resources">
          <h3>{{ resource.name }}</h3>
          <p>{{ resource.description }}</p>
          <span>{{ resource.category }}</span>
          <a [href]="resource.officialUrl" target="_blank" class="link-btn">Official portal</a>
        </article>
      </div>
    </section>
  `,
  styles: ['']
})
export class HomePageComponent implements OnInit {
  popularSchemes: Scheme[] = [];
  videos: Video[] = [];
  resources: ResourceItem[] = [];
  categories = ['Education', 'Employment', 'Health', 'Women', 'Students', 'Farmers', 'Financial Assistance', 'Senior Citizens'];

  stats = [
    { value: '10+', label: 'schemes' },
    { value: '5+', label: 'resources' },
    { value: '100%', label: 'official links' }
  ];

  highlights = [
    { label: 'Popular today', title: 'PM-KISAN', description: 'Income support for eligible farmers.' },
    { label: 'Health support', title: 'PM-JAY', description: 'Cashless treatment for families in need.' }
  ];

  steps = [
    { title: 'Search', description: 'Find a scheme or category matching your needs.' },
    { title: 'Check eligibility', description: 'Review the target group, documents, and benefits.' },
    { title: 'Apply officially', description: 'Use the official website with the correct process.' }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const localSchemes = this.readLocalSchemes();
    const localVideos = this.readLocalVideos();
    const localResources = this.readLocalResources();

    this.popularSchemes = localSchemes.slice(0, 4);
    this.videos = localVideos.slice(0, 3);
    this.resources = localResources.slice(0, 4);

    this.apiService.getSchemes().subscribe((schemes) => {
      this.popularSchemes = schemes.slice(0, 4);
    });
    this.apiService.getVideos().subscribe((videos) => {
      this.videos = videos.slice(0, 3);
    });
    this.apiService.getResources().subscribe((resources) => {
      this.resources = resources.slice(0, 4);
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

  private readLocalVideos(): Video[] {
    try {
      const raw = localStorage.getItem('jansahayak.videos');
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) && parsed.length ? parsed : this.apiService.fallbackVideos;
    } catch {
      return this.apiService.fallbackVideos;
    }
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
}
