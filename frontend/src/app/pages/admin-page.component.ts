import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardStats, ResourceItem, Scheme, Video } from '../models';
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

    <ng-container *ngIf="isAdmin; else adminOnly">
      <section class="stats-grid">
        <article class="stat-card" *ngFor="let stat of dashboardStats">
          <h3>{{ stat.title }}</h3>
          <strong>{{ stat.value }}</strong>
        </article>
      </section>
      <p class="admin-status" *ngIf="statsLoading">Refreshing portal statistics...</p>
      <div class="admin-status error" *ngIf="statsError">
        <span>{{ statsError }}</span>
        <button type="button" class="secondary-btn compact" (click)="refreshStats()">Retry</button>
      </div>

    <div class="admin-panel">
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
          <button type="submit" class="primary-btn">{{ editingId ? 'Save changes' : 'Add scheme' }}</button>
          <button *ngIf="editingId" type="button" class="secondary-btn" (click)="cancelEdit()">Cancel</button>
        </form>

        <form class="admin-form" *ngIf="selectedAction === 'video'" (ngSubmit)="submitVideo()">
          <input [(ngModel)]="newVideo.title" name="videoTitle" placeholder="Video title" required />
          <input [(ngModel)]="newVideo.category" name="videoCategory" placeholder="Category" required />
          <textarea [(ngModel)]="newVideo.description" name="videoDescription" placeholder="Description" required></textarea>
          <input [(ngModel)]="newVideo.youtubeUrl" name="videoUrl" placeholder="YouTube URL" required />
          <button type="submit" class="primary-btn">{{ editingId ? 'Save changes' : 'Add video' }}</button>
          <button *ngIf="editingId" type="button" class="secondary-btn" (click)="cancelEdit()">Cancel</button>
        </form>

        <form class="admin-form" *ngIf="selectedAction === 'resource'" (ngSubmit)="submitResource()">
          <input [(ngModel)]="newResource.name" name="resourceName" placeholder="Resource name" required />
          <input [(ngModel)]="newResource.category" name="resourceCategory" placeholder="Category" required />
          <textarea [(ngModel)]="newResource.description" name="resourceDescription" placeholder="Description" required></textarea>
          <input [(ngModel)]="newResource.officialUrl" name="resourceUrl" placeholder="Official URL" required />
          <button type="submit" class="primary-btn">{{ editingId ? 'Save changes' : 'Add resource' }}</button>
          <button *ngIf="editingId" type="button" class="secondary-btn" (click)="cancelEdit()">Cancel</button>
        </form>
      </div>

    </div>

    <section class="admin-panel content-manager">
      <div class="admin-panel-header">
        <div>
          <h2>Manage portal content</h2>
          <p>Search, update, or remove published schemes, videos, and resources.</p>
        </div>
        <button type="button" class="secondary-btn compact" (click)="loadContent()">Refresh list</button>
      </div>

      <div class="manager-controls">
        <div class="manager-tabs" role="tablist" aria-label="Content type">
          <button type="button" [class.active]="contentType === 'schemes'" (click)="contentType = 'schemes'">Schemes ({{ schemes.length }})</button>
          <button type="button" [class.active]="contentType === 'videos'" (click)="contentType = 'videos'">Videos ({{ videos.length }})</button>
          <button type="button" [class.active]="contentType === 'resources'" (click)="contentType = 'resources'">Resources ({{ resources.length }})</button>
        </div>
        <input [(ngModel)]="contentSearch" name="contentSearch" placeholder="Search this content list" aria-label="Search content" />
      </div>

      <p class="admin-status" *ngIf="contentLoading">Loading content...</p>
      <p class="admin-status error" *ngIf="contentError">{{ contentError }}</p>

      <div class="managed-list" *ngIf="!contentLoading && contentType === 'schemes'">
        <article class="managed-item" *ngFor="let scheme of filteredSchemes">
          <div><strong>{{ scheme.name }}</strong><span>{{ scheme.category }} · {{ scheme.targetGroup }}</span></div>
          <div class="managed-actions">
            <button type="button" class="secondary-btn compact" (click)="editScheme(scheme)">Edit</button>
            <button type="button" class="danger-btn compact" (click)="deleteScheme(scheme)">Delete</button>
          </div>
        </article>
        <p class="empty-state" *ngIf="!filteredSchemes.length">No schemes match this search.</p>
      </div>

      <div class="managed-list" *ngIf="!contentLoading && contentType === 'videos'">
        <article class="managed-item" *ngFor="let video of filteredVideos">
          <div><strong>{{ video.title }}</strong><span>{{ video.category }}</span></div>
          <div class="managed-actions">
            <button type="button" class="secondary-btn compact" (click)="editVideo(video)">Edit</button>
            <button type="button" class="danger-btn compact" (click)="deleteVideo(video)">Delete</button>
          </div>
        </article>
        <p class="empty-state" *ngIf="!filteredVideos.length">No videos match this search.</p>
      </div>

      <div class="managed-list" *ngIf="!contentLoading && contentType === 'resources'">
        <article class="managed-item" *ngFor="let resource of filteredResources">
          <div><strong>{{ resource.name }}</strong><span>{{ resource.category }}</span></div>
          <div class="managed-actions">
            <button type="button" class="secondary-btn compact" (click)="editResource(resource)">Edit</button>
            <button type="button" class="danger-btn compact" (click)="deleteResource(resource)">Delete</button>
          </div>
        </article>
        <p class="empty-state" *ngIf="!filteredResources.length">No resources match this search.</p>
      </div>
    </section>
    </ng-container>

    <ng-template #adminOnly>
      <div class="empty-state"><p>Administrator access is required to manage portal content.</p></div>
    </ng-template>
  `,
  styles: [`
    .admin-status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      color: #475569;
      margin: 0.75rem 0;
    }

    .admin-status.error {
      color: #b42318;
    }

    .admin-panel-header p {
      margin: 0.35rem 0 0;
      color: #64748b;
    }

    .manager-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin: 1rem 0;
    }

    .manager-tabs,
    .managed-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .manager-tabs button {
      border: 1px solid #cbd5e1;
      background: white;
      color: #334155;
      padding: 0.6rem 0.8rem;
      cursor: pointer;
    }

    .manager-tabs button.active {
      background: #164e63;
      border-color: #164e63;
      color: white;
    }

    .manager-controls input {
      width: min(100%, 300px);
      padding: 0.7rem 0.85rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
    }

    .managed-list {
      display: grid;
      gap: 0.65rem;
    }

    .managed-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.85rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #fff;
    }

    .managed-item > div:first-child {
      display: grid;
      gap: 0.25rem;
      min-width: 0;
    }

    .managed-item span {
      color: #64748b;
      font-size: 0.9rem;
    }

    .danger-btn {
      border: 0;
      border-radius: 6px;
      padding: 0.55rem 0.75rem;
      background: #b42318;
      color: white;
      cursor: pointer;
    }

    @media (max-width: 680px) {
      .manager-controls,
      .managed-item {
        align-items: stretch;
        flex-direction: column;
      }

      .manager-controls input {
        width: 100%;
      }
    }
  `]
})
export class AdminPageComponent implements OnInit {
  stats: DashboardStats | null = null;
  selectedAction: 'scheme' | 'video' | 'resource' | null = null;
  editingId: number | null = null;
  editingItem: Scheme | Video | ResourceItem | null = null;
  schemes: Scheme[] = [];
  videos: Video[] = [];
  resources: ResourceItem[] = [];
  contentType: 'schemes' | 'videos' | 'resources' = 'schemes';
  contentSearch = '';
  contentLoading = false;
  contentError = '';
  statsLoading = false;
  statsError = '';

  dashboardStats = [
    { title: 'Total schemes', value: 'Loading' },
    { title: 'Total videos', value: 'Loading' },
    { title: 'Total resources', value: 'Loading' },
    { title: 'Total users', value: 'Loading' },
    { title: 'Saved bookmarks', value: 'Loading' }
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
    if (this.editingId) {
      return `Edit ${this.selectedAction}`;
    }
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
    this.cancelEdit();
    this.selectedAction = action;
  }

  get filteredSchemes(): Scheme[] {
    return this.filterItems(this.schemes, (item) => `${item.name} ${item.category} ${item.targetGroup} ${item.description}`);
  }

  get filteredVideos(): Video[] {
    return this.filterItems(this.videos, (item) => `${item.title} ${item.category} ${item.description}`);
  }

  get filteredResources(): ResourceItem[] {
    return this.filterItems(this.resources, (item) => `${item.name} ${item.category} ${item.description}`);
  }

  private filterItems<T>(items: T[], searchableText: (item: T) => string): T[] {
    const query = this.contentSearch.trim().toLowerCase();
    return query ? items.filter((item) => searchableText(item).toLowerCase().includes(query)) : items;
  }

  loadContent(): void {
    this.contentLoading = true;
    this.contentError = '';
    this.apiService.getAdminContent().subscribe({
      next: (content) => {
        this.schemes = content.schemes;
        this.videos = content.videos;
        this.resources = content.resources;
        this.contentLoading = false;
      },
      error: () => {
        this.contentError = 'Could not load portal content from the server.';
        this.contentLoading = false;
      }
    });
  }

  editScheme(scheme: Scheme): void {
    this.selectedAction = 'scheme';
    this.editingId = scheme.id ?? null;
    this.editingItem = scheme;
    this.newScheme = {
      name: scheme.name,
      category: scheme.category,
      targetGroup: scheme.targetGroup,
      description: scheme.description,
      officialWebsite: scheme.officialWebsite
    };
  }

  editVideo(video: Video): void {
    this.selectedAction = 'video';
    this.editingId = video.id ?? null;
    this.editingItem = video;
    this.newVideo = { title: video.title, category: video.category, description: video.description, youtubeUrl: video.youtubeUrl };
  }

  editResource(resource: ResourceItem): void {
    this.selectedAction = 'resource';
    this.editingId = resource.id ?? null;
    this.editingItem = resource;
    this.newResource = { name: resource.name, category: resource.category, description: resource.description, officialUrl: resource.officialUrl };
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editingItem = null;
    this.newScheme = { name: '', category: '', targetGroup: '', description: '', officialWebsite: '' };
    this.newVideo = { title: '', category: '', description: '', youtubeUrl: '' };
    this.newResource = { name: '', category: '', description: '', officialUrl: '' };
  }

  private completeSave(): void {
    this.cancelEdit();
    this.selectedAction = null;
    this.loadContent();
    this.refreshStats();
  }

  deleteScheme(scheme: Scheme): void {
    if (!scheme.id || !window.confirm(`Delete "${scheme.name}"? This cannot be undone.`)) return;
    this.apiService.deleteScheme(scheme.id).subscribe({
      next: () => { this.schemes = this.schemes.filter((item) => item.id !== scheme.id); this.refreshStats(); },
      error: () => alert('Scheme could not be deleted. Check administrator access and try again.')
    });
  }

  deleteVideo(video: Video): void {
    if (!video.id || !window.confirm(`Delete "${video.title}"? This cannot be undone.`)) return;
    this.apiService.deleteVideo(video.id).subscribe({
      next: () => { this.videos = this.videos.filter((item) => item.id !== video.id); this.refreshStats(); },
      error: () => alert('Video could not be deleted. Check administrator access and try again.')
    });
  }

  deleteResource(resource: ResourceItem): void {
    if (!resource.id || !window.confirm(`Delete "${resource.name}"? This cannot be undone.`)) return;
    this.apiService.deleteResource(resource.id).subscribe({
      next: () => { this.resources = this.resources.filter((item) => item.id !== resource.id); this.refreshStats(); },
      error: () => alert('Resource could not be deleted. Check administrator access and try again.')
    });
  }

  submitScheme(): void {
    const schemeData: Partial<Scheme> = {
      ...(this.editingItem as Scheme | null),
      name: this.newScheme.name,
      category: this.newScheme.category,
      targetGroup: this.newScheme.targetGroup,
      description: this.newScheme.description,
      officialWebsite: this.newScheme.officialWebsite,
      eligibility: 'Check the official scheme rules for details.',
      benefits: 'Updated through the admin dashboard.',
      requiredDocuments: 'As specified by the official scheme guidelines.',
      applicationProcess: 'Apply through the official portal provided above.'
    };
    const request = this.editingId
      ? this.apiService.updateScheme(this.editingId, schemeData)
      : this.apiService.addScheme(schemeData);
    request.subscribe({
      next: () => {
        this.completeSave();
      },
      error: () => alert('Scheme could not be saved. Verify your administrator sign-in and backend connection.')
    });
  }

  submitVideo(): void {
    const videoData: Partial<Video> = {
      ...(this.editingItem as Video | null),
      title: this.newVideo.title,
      category: this.newVideo.category,
      description: this.newVideo.description,
      youtubeUrl: this.newVideo.youtubeUrl
    };
    const request = this.editingId
      ? this.apiService.updateVideo(this.editingId, videoData)
      : this.apiService.addVideo(videoData);
    request.subscribe({
      next: () => {
        this.completeSave();
      },
      error: () => alert('Video could not be saved. Verify your administrator sign-in and backend connection.')
    });
  }

  submitResource(): void {
    const resourceData: Partial<ResourceItem> = {
      ...(this.editingItem as ResourceItem | null),
      name: this.newResource.name,
      category: this.newResource.category,
      description: this.newResource.description,
      officialUrl: this.newResource.officialUrl
    };
    const request = this.editingId
      ? this.apiService.updateResource(this.editingId, resourceData)
      : this.apiService.addResource(resourceData);
    request.subscribe({
      next: () => {
        this.completeSave();
      },
      error: () => alert('Resource could not be saved. Verify your administrator sign-in and backend connection.')
    });
  }

  refreshStats(): void {
    this.statsLoading = true;
    this.statsError = '';
    this.apiService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.dashboardStats = [
          { title: 'Total schemes', value: String(stats.totalSchemes) },
          { title: 'Total videos', value: String(stats.totalVideos) },
          { title: 'Total resources', value: String(stats.totalResources) },
          { title: 'Total users', value: String(stats.totalUsers) },
          { title: 'Saved bookmarks', value: String(stats.totalBookmarks) }
        ];
        this.statsLoading = false;
      },
      error: () => {
        this.statsError = 'Statistics could not be loaded. Confirm the admin session and backend connection.';
        this.dashboardStats = this.dashboardStats.map((stat) => ({ ...stat, value: 'Unavailable' }));
        this.statsLoading = false;
      }
    });
  }

  ngOnInit(): void {
    if (this.isAdmin) {
      this.refreshStats();
      this.loadContent();
    }
  }
}
