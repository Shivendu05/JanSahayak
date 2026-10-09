import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardStats } from '../models';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-header">
      <h1>Admin dashboard</h1>
      <p>Monitor the core public welfare portal data and manage content.</p>
    </section>

    <div class="stats-grid" *ngIf="stats">
      <div class="stat-card" *ngFor="let stat of dashboardStats">
        <h3>{{ stat.title }}</h3>
        <strong>{{ stat.value }}</strong>
      </div>
    </div>

    <div class="admin-panel" *ngIf="isAdmin; else adminOnly">
      <div class="admin-panel-header">
        <h2>Quick admin actions</h2>
        <span class="mini-tag">Operations</span>
      </div>

      <div class="action-grid">
        <button type="button" class="action-card" *ngFor="let action of adminActions" (click)="selectAction(action.type)">
          <span class="action-icon">{{ action.icon }}</span>
          <div>
            <strong>{{ action.title }}</strong>
            <small>{{ action.description }}</small>
          </div>
        </button>
      </div>

      <div class="form-shell" *ngIf="selectedAction">
        <h3>{{ selectedActionTitle }}</h3>

        <form class="admin-form" *ngIf="selectedAction === 'scheme'" (ngSubmit)="submitScheme()">
          <input [(ngModel)]="newScheme.name" name="schemeName" placeholder="Scheme name" required />
          <input [(ngModel)]="newScheme.category" name="schemeCategory" placeholder="Category" required />
          <input [(ngModel)]="newScheme.targetGroup" name="schemeTargetGroup" placeholder="Target group" required />
          <textarea [(ngModel)]="newScheme.description" name="schemeDescription" placeholder="Description" required></textarea>
          <input [(ngModel)]="newScheme.officialWebsite" name="schemeWebsite" placeholder="Official website URL" required />
          <button type="submit" class="primary-btn">Add scheme</button>
        </form>

        <form class="admin-form" *ngIf="selectedAction === 'video'" (ngSubmit)="submitVideo()">
          <input [(ngModel)]="newVideo.title" name="videoTitle" placeholder="Video title" required />
          <input [(ngModel)]="newVideo.category" name="videoCategory" placeholder="Category" required />
          <textarea [(ngModel)]="newVideo.description" name="videoDescription" placeholder="Description" required></textarea>
          <input [(ngModel)]="newVideo.youtubeUrl" name="videoUrl" placeholder="YouTube URL" required />
          <button type="submit" class="primary-btn">Add video</button>
        </form>

        <form class="admin-form" *ngIf="selectedAction === 'resource'" (ngSubmit)="submitResource()">
          <input [(ngModel)]="newResource.name" name="resourceName" placeholder="Resource name" required />
          <input [(ngModel)]="newResource.category" name="resourceCategory" placeholder="Category" required />
          <textarea [(ngModel)]="newResource.description" name="resourceDescription" placeholder="Description" required></textarea>
          <input [(ngModel)]="newResource.officialUrl" name="resourceUrl" placeholder="Official URL" required />
          <button type="submit" class="primary-btn">Add resource</button>
        </form>
      </div>

    </div>

    <ng-template #adminOnly>
      <div class="empty-state"><p>Administrator access is required to manage portal content.</p></div>
    </ng-template>
  `,
  styles: [``]
})
export class AdminPageComponent implements OnInit {
  stats: DashboardStats | null = null;
  selectedAction: 'scheme' | 'video' | 'resource' | null = null;

  dashboardStats = [
    { title: 'Total schemes', value: '0' },
    { title: 'Total resources', value: '0' },
    { title: 'Total videos', value: '0' },
    { title: 'Total users', value: '0' }
  ];

  adminActions = [
    { type: 'scheme', icon: '➕', title: 'Add scheme', description: 'Add new public welfare schemes and update content.' },
    { type: 'video', icon: '🎥', title: 'Add video', description: 'Add educational videos and awareness materials.' },
    { type: 'resource', icon: '📚', title: 'Add resource', description: 'Add useful official portals and help links.' }
  ] as const;

  newScheme = {
    name: '',
    category: '',
    targetGroup: '',
    description: '',
    officialWebsite: ''
  };

  newVideo = {
    title: '',
    category: '',
    description: '',
    youtubeUrl: ''
  };

  newResource = {
    name: '',
    category: '',
    description: '',
    officialUrl: ''
  };

  constructor(private apiService: ApiService) {}

  get isAdmin(): boolean {
    try {
      return JSON.parse(localStorage.getItem('user') ?? 'null')?.role === 'ADMIN';
    } catch {
      return false;
    }
  }

  get selectedActionTitle(): string {
    if (this.selectedAction === 'scheme') {
      return 'Add a new scheme';
    }
    if (this.selectedAction === 'video') {
      return 'Add a video';
    }
    if (this.selectedAction === 'resource') {
      return 'Add a resource';
    }
    return 'Choose an action';
  }

  selectAction(action: 'scheme' | 'video' | 'resource'): void {
    this.selectedAction = action;
  }

  submitScheme(): void {
    this.apiService.addScheme({
      id: undefined,
      name: this.newScheme.name,
      category: this.newScheme.category,
      targetGroup: this.newScheme.targetGroup,
      description: this.newScheme.description,
      officialWebsite: this.newScheme.officialWebsite,
      eligibility: 'Check the official scheme rules for details.',
      benefits: 'Updated through the admin dashboard.',
      requiredDocuments: 'As specified by the official scheme guidelines.',
      applicationProcess: 'Apply through the official portal provided above.'
    }).subscribe({
      next: () => {
        this.newScheme = { name: '', category: '', targetGroup: '', description: '', officialWebsite: '' };
        this.selectedAction = null;
        this.refreshStats();
      },
      error: () => alert('Scheme could not be saved. Verify your administrator sign-in and backend connection.')
    });
  }

  submitVideo(): void {
    this.apiService.addVideo({
      id: undefined,
      title: this.newVideo.title,
      category: this.newVideo.category,
      description: this.newVideo.description,
      youtubeUrl: this.newVideo.youtubeUrl
    }).subscribe({
      next: () => {
        this.newVideo = { title: '', category: '', description: '', youtubeUrl: '' };
        this.selectedAction = null;
        this.refreshStats();
      },
      error: () => alert('Video could not be saved. Verify your administrator sign-in and backend connection.')
    });
  }

  submitResource(): void {
    this.apiService.addResource({
      id: undefined,
      name: this.newResource.name,
      category: this.newResource.category,
      description: this.newResource.description,
      officialUrl: this.newResource.officialUrl
    }).subscribe({
      next: () => {
        this.newResource = { name: '', category: '', description: '', officialUrl: '' };
        this.selectedAction = null;
        this.refreshStats();
      },
      error: () => alert('Resource could not be saved. Verify your administrator sign-in and backend connection.')
    });
  }

  refreshStats(): void {
    this.apiService.getDashboardStats().subscribe((stats) => {
      this.stats = stats;
      this.dashboardStats = [
        { title: 'Total schemes', value: String(stats.totalSchemes) },
        { title: 'Total resources', value: String(stats.totalResources) },
        { title: 'Total videos', value: String(stats.totalVideos) },
        { title: 'Total users', value: String(stats.totalUsers) }
      ];
    });
  }

  ngOnInit(): void {
    if (this.isAdmin) {
      this.refreshStats();
    }
  }
}
