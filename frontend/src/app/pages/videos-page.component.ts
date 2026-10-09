import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Scheme, Video } from '../models';

@Component({
  selector: 'app-videos-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-header">
      <h1>Useful videos</h1>
      <p>Helpful educational and awareness videos linked to government schemes and financial support.</p>
    </section>

    <div class="toolbar" *ngIf="relatedSchemes.length">
      <span>Related schemes:</span>
      <a *ngFor="let scheme of relatedSchemes" [routerLink]="['/schemes', scheme.id]" class="chip secondary-tag">
        {{ scheme.name }}
      </a>
    </div>

    <div class="video-grid">
      <article class="video-card" *ngFor="let video of videos">
        <span class="chip">{{ video.category }}</span>
        <h3>{{ video.title }}</h3>
        <p>{{ video.description }}</p>
        <a [href]="video.youtubeUrl" target="_blank" class="primary-btn compact">Watch video</a>
      </article>
    </div>
  `,
  styles: ['']
})
export class VideosPageComponent implements OnInit {
  videos: Video[] = [];
  relatedSchemes: Scheme[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const localVideos = this.readLocalVideos();
    const localSchemes = this.readLocalSchemes();

    this.videos = localVideos;
    this.relatedSchemes = localSchemes.slice(0, 4);

    this.apiService.getVideos().subscribe((videos) => {
      this.videos = videos;
    });

    this.apiService.getSchemes().subscribe((schemes) => {
      this.relatedSchemes = schemes.slice(0, 4);
    });
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
