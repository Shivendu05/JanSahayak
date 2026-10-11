import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { DashboardStats, ResourceItem, Scheme, UserSession, Video } from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = ['localhost', '127.0.0.1'].includes(window.location.hostname)
? 'http://localhost:8081'
: 'https://jansahayak-ubq8.onrender.com';

  private readonly schemeStorageKey = 'jansahayak.schemes';
  private readonly videoStorageKey = 'jansahayak.videos';
  private readonly resourceStorageKey = 'jansahayak.resources';
  private readonly savedSchemeStorageKeyPrefix = 'jansahayak.saved.';

  readonly categories = [
    'Education',
    'Employment',
    'Health',
    'Women',
    'Students',
    'Farmers',
    'Financial Assistance',
    'Senior Citizens'
  ];

  readonly fallbackSchemes: Scheme[] = [
    {
      id: 1,
      name: 'PM-KISAN',
      fullName: 'Pradhan Mantri Kisan Samman Nidhi',
      description: 'Direct income support for eligible farmers.',
      category: 'Farmers',
      targetGroup: 'Small and marginal farmers',
      eligibility: 'Landholding eligibility as defined by government norms and registration in the PM-KISAN portal.',
      benefits: 'Annual financial assistance',
      requiredDocuments: 'Aadhaar and land-related records',
      applicationProcess: 'Register on the PM-KISAN portal and complete eKYC.',
      deadline: 'Check official portal for current schedule',
      officialWebsite: 'https://pmkisan.gov.in/',
      officialApplicationUrl: 'https://pmkisan.gov.in/',
      purpose: 'Income support for eligible farmer families to help with agricultural and household expenses.',
      department: 'Department of Agriculture & Farmers Welfare',
      level: 'Central Government',
      tags: 'farmer, income-support, agriculture',
      source: 'Official PM-KISAN portal',
      lastVerified: '2026-10',
      videoTitle: 'PM-KISAN Government Information',
      videoUrl: 'https://www.youtube.com/results?search_query=PM-KISAN+India'
    },
    {
      id: 2,
      name: 'Ayushman Bharat PM-JAY',
      fullName: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana',
      description: 'Health coverage for poor and vulnerable families.',
      category: 'Health',
      targetGroup: 'Low-income families',
      eligibility: 'Based on official eligibility and beneficiary records.',
      benefits: 'Cashless treatment and hospitalization support.',
      requiredDocuments: 'Identity and family records',
      applicationProcess: 'Check eligibility and visit empanelled hospitals.',
      deadline: 'Varies by state',
      officialWebsite: 'https://pmjay.gov.in/',
      officialApplicationUrl: 'https://pmjay.gov.in/',
      purpose: 'Healthcare coverage for eligible low-income families and senior citizens.',
      department: 'Ministry of Health and Family Welfare',
      level: 'Central Government',
      tags: 'healthcare, insurance, family',
      source: 'Official PM-JAY portal',
      lastVerified: '2026-10',
      videoTitle: 'Ayushman Bharat Overview',
      videoUrl: 'https://www.youtube.com/results?search_query=Ayushman+Bharat+overview'
    },
    {
      id: 3,
      name: 'Pradhan Mantri Ujjwala Yojana',
      fullName: 'Pradhan Mantri Ujjwala Yojana',
      description: 'Free LPG connections for women from eligible households.',
      category: 'Women',
      targetGroup: 'Women in low-income households',
      eligibility: 'Based on household income and scheme rules.',
      benefits: 'Free LPG connection and cleaner cooking fuel.',
      requiredDocuments: 'Aadhaar and household documents',
      applicationProcess: 'Apply through the official portal or local distributor.',
      deadline: 'Official updates apply',
      officialWebsite: 'https://www.pmuy.gov.in/',
      officialApplicationUrl: 'https://www.pmuy.gov.in/',
      purpose: 'Support eligible households with clean cooking fuel access and reduced health risks.',
      department: 'Ministry of Petroleum & Natural Gas',
      level: 'Central Government',
      tags: 'women, energy, cooking',
      source: 'Official Ujjwala portal',
      lastVerified: '2026-10',
      videoTitle: 'Ujjwala Yojana Explained',
      videoUrl: 'https://www.youtube.com/results?search_query=Ujjwala+Yojana'
    }
  ];

  readonly fallbackVideos: Video[] = [
    {
      id: 1,
      title: 'PM-KISAN Explained',
      description: 'Simple overview of the scheme and who can apply.',
      category: 'Government Schemes',
      youtubeUrl: 'https://www.youtube.com/results?search_query=PM-KISAN+scheme+explained'
    },
    {
      id: 2,
      title: 'How to Apply for Scholarships',
      description: 'Guide to National Scholarship Portal steps.',
      category: 'Education',
      youtubeUrl: 'https://www.youtube.com/results?search_query=National+Scholarship+Portal+guide'
    }
  ];

  readonly fallbackResources: ResourceItem[] = [
    {
      id: 1,
      name: 'India Gov',
      description: 'Official government information portal.',
      category: 'Government Portals',
      officialUrl: 'https://www.india.gov.in/'
    },
    {
      id: 2,
      name: 'National Scholarship Portal',
      description: 'Government scholarship portal for students.',
      category: 'Scholarships',
      officialUrl: 'https://scholarships.gov.in/'
    }
  ];

  constructor() {
    this.ensureLocalData();
  }

  private ensureLocalData(): void {
    if (!localStorage.getItem(this.schemeStorageKey)) {
      localStorage.setItem(this.schemeStorageKey, JSON.stringify(this.fallbackSchemes));
    }
    if (!localStorage.getItem(this.videoStorageKey)) {
      localStorage.setItem(this.videoStorageKey, JSON.stringify(this.fallbackVideos));
    }
    if (!localStorage.getItem(this.resourceStorageKey)) {
      localStorage.setItem(this.resourceStorageKey, JSON.stringify(this.fallbackResources));
    }
  }

  private readLocalList<T>(key: string, fallback: T[]): T[] {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        return fallback;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  private writeLocalList<T>(key: string, items: T[]): void {
    localStorage.setItem(key, JSON.stringify(items));
  }

  private mergeWithLocalList<T>(remote: T[], stored: T[]): T[] {
    const merged: T[] = [];
    const seen = new Set<string>();

    [...stored, ...remote].forEach((item) => {
      const key = JSON.stringify(item);
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    });

    return merged;
  }

  private getSavedSchemeKey(userId: number): string {
    return `${this.savedSchemeStorageKeyPrefix}${userId}`;
  }

  private readSavedSchemeIds(userId: number): number[] {
    try {
      const raw = localStorage.getItem(this.getSavedSchemeKey(userId));
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map((value) => Number(value)).filter((value) => !Number.isNaN(value)) : [];
    } catch {
      return [];
    }
  }

  private persistSavedSchemeIds(userId: number, schemeIds: number[]): void {
    localStorage.setItem(this.getSavedSchemeKey(userId), JSON.stringify([...new Set(schemeIds)]));
  }

  getSchemes(): Observable<Scheme[]> {
    const cachedSchemes = this.readLocalList(this.schemeStorageKey, this.fallbackSchemes);

    return this.http.get<Scheme[]>(`${this.baseUrl}/api/schemes`).pipe(
      map((schemes) => {
        const merged = this.mergeWithLocalList(schemes, cachedSchemes);
        this.writeLocalList(this.schemeStorageKey, merged);
        return merged;
      }),
      catchError(() => of(cachedSchemes))
    );
  }

  getSchemeById(id: number): Observable<Scheme> {
    const cached = this.readLocalList(this.schemeStorageKey, this.fallbackSchemes);
    const fallbackScheme = cached.find((scheme) => scheme.id === id) ?? this.fallbackSchemes.find((scheme) => scheme.id === id);

    return this.http.get<Scheme>(`${this.baseUrl}/api/schemes/${id}`).pipe(
      map((scheme) => scheme ?? fallbackScheme),
      catchError(() => of(fallbackScheme as Scheme))
    );
  }

  searchSchemes(keyword: string): Observable<Scheme[]> {
    const cached = this.readLocalList(this.schemeStorageKey, this.fallbackSchemes);
    const localResults = cached.filter((scheme) =>
      scheme.name.toLowerCase().includes(keyword.toLowerCase()) ||
      (scheme.description || '').toLowerCase().includes(keyword.toLowerCase())
    );

    return this.http.get<Scheme[]>(`${this.baseUrl}/api/schemes/search?keyword=${encodeURIComponent(keyword)}`).pipe(
      map((schemes) => schemes.length ? schemes : localResults),
      catchError(() => of(localResults))
    );
  }

  getVideos(): Observable<Video[]> {
    const cachedVideos = this.readLocalList(this.videoStorageKey, this.fallbackVideos);

    return this.http.get<Video[]>(`${this.baseUrl}/api/videos`).pipe(
      map((videos) => {
        const merged = this.mergeWithLocalList(videos, cachedVideos);
        this.writeLocalList(this.videoStorageKey, merged);
        return merged;
      }),
      catchError(() => of(cachedVideos))
    );
  }

  getResources(): Observable<ResourceItem[]> {
    const cachedResources = this.readLocalList(this.resourceStorageKey, this.fallbackResources);

    return this.http.get<ResourceItem[]>(`${this.baseUrl}/api/resources`).pipe(
      map((resources) => {
        const merged = this.mergeWithLocalList(resources, cachedResources);
        this.writeLocalList(this.resourceStorageKey, merged);
        return merged;
      }),
      catchError(() => of(cachedResources))
    );
  }

  register(data: { name: string; email: string; password: string }): Observable<UserSession> {
    return this.http.post<UserSession>(`${this.baseUrl}/api/auth/register`, data);
  }

  login(data: { email: string; password: string }, role: 'USER' | 'ADMIN'): Observable<UserSession> {
    return this.http.post<UserSession>(`${this.baseUrl}/api/auth/login/${role.toLowerCase()}`, data);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/api/auth/logout`, {});
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/api/dashboard`);
  }

  getAdminContent(): Observable<{ schemes: Scheme[]; videos: Video[]; resources: ResourceItem[] }> {
    return forkJoin({
      schemes: this.http.get<Scheme[]>(`${this.baseUrl}/api/schemes`),
      videos: this.http.get<Video[]>(`${this.baseUrl}/api/videos`),
      resources: this.http.get<ResourceItem[]>(`${this.baseUrl}/api/resources`)
    });
  }

  addScheme(scheme: Partial<Scheme>): Observable<Scheme> {
    return this.http.post<Scheme>(`${this.baseUrl}/api/schemes`, scheme).pipe(
      map((created) => {
        const existing = this.readLocalList(this.schemeStorageKey, this.fallbackSchemes);
        this.writeLocalList(this.schemeStorageKey, [created, ...existing.filter((item) => item.id !== created.id)]);
        return created;
      })
    );
  }

  updateScheme(id: number, scheme: Partial<Scheme>): Observable<Scheme> {
    return this.http.put<Scheme>(`${this.baseUrl}/api/schemes/${id}`, scheme).pipe(
      map((updated) => {
        const existing = this.readLocalList(this.schemeStorageKey, this.fallbackSchemes);
        this.writeLocalList(this.schemeStorageKey, existing.map((item) => item.id === id ? updated : item));
        return updated;
      })
    );
  }

  deleteScheme(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/schemes/${id}`).pipe(
      map(() => {
        const existing = this.readLocalList(this.schemeStorageKey, this.fallbackSchemes);
        this.writeLocalList(this.schemeStorageKey, existing.filter((item) => item.id !== id));
      })
    );
  }

  addVideo(video: Partial<Video>): Observable<Video> {
    return this.http.post<Video>(`${this.baseUrl}/api/videos`, video).pipe(
      map((created) => {
        const existing = this.readLocalList(this.videoStorageKey, this.fallbackVideos);
        this.writeLocalList(this.videoStorageKey, [created, ...existing.filter((item) => item.id !== created.id)]);
        return created;
      })
    );
  }

  updateVideo(id: number, video: Partial<Video>): Observable<Video> {
    return this.http.put<Video>(`${this.baseUrl}/api/videos/${id}`, video).pipe(
      map((updated) => {
        const existing = this.readLocalList(this.videoStorageKey, this.fallbackVideos);
        this.writeLocalList(this.videoStorageKey, existing.map((item) => item.id === id ? updated : item));
        return updated;
      })
    );
  }

  deleteVideo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/videos/${id}`).pipe(
      map(() => {
        const existing = this.readLocalList(this.videoStorageKey, this.fallbackVideos);
        this.writeLocalList(this.videoStorageKey, existing.filter((item) => item.id !== id));
      })
    );
  }

  addResource(resource: Partial<ResourceItem>): Observable<ResourceItem> {
    return this.http.post<ResourceItem>(`${this.baseUrl}/api/resources`, resource).pipe(
      map((created) => {
        const existing = this.readLocalList(this.resourceStorageKey, this.fallbackResources);
        this.writeLocalList(this.resourceStorageKey, [created, ...existing.filter((item) => item.id !== created.id)]);
        return created;
      })
    );
  }

  updateResource(id: number, resource: Partial<ResourceItem>): Observable<ResourceItem> {
    return this.http.put<ResourceItem>(`${this.baseUrl}/api/resources/${id}`, resource).pipe(
      map((updated) => {
        const existing = this.readLocalList(this.resourceStorageKey, this.fallbackResources);
        this.writeLocalList(this.resourceStorageKey, existing.map((item) => item.id === id ? updated : item));
        return updated;
      })
    );
  }

  deleteResource(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/resources/${id}`).pipe(
      map(() => {
        const existing = this.readLocalList(this.resourceStorageKey, this.fallbackResources);
        this.writeLocalList(this.resourceStorageKey, existing.filter((item) => item.id !== id));
      })
    );
  }

  getSavedSchemes(userId: number): Observable<Scheme[]> {
    const localSavedIds = this.readSavedSchemeIds(userId);
    const knownSchemes = this.readLocalList(this.schemeStorageKey, this.fallbackSchemes);
    const localSaved = knownSchemes.filter((scheme) =>
      scheme.id !== undefined && localSavedIds.includes(Number(scheme.id))
    );

    const fallbackSaved = this.fallbackSchemes.filter((scheme) =>
      scheme.id !== undefined && localSavedIds.includes(Number(scheme.id))
    );

    return this.http.get<Array<{ scheme?: Scheme; schemeId?: number; id?: number; name?: string; category?: string; description?: string; targetGroup?: string; tags?: string }>>(`${this.baseUrl}/api/bookmarks/user/${userId}`).pipe(
      map((bookmarks) => {
        const normalized = Array.isArray(bookmarks) ? bookmarks : [];
        const remoteSaved = normalized
          .map((bookmark) => {
            if (bookmark.scheme && typeof bookmark.scheme === 'object') {
              return bookmark.scheme as Scheme;
            }

            if (bookmark.name || bookmark.category || bookmark.description) {
              return {
                id: bookmark.id,
                name: bookmark.name ?? 'Saved scheme',
                category: bookmark.category ?? 'General',
                description: bookmark.description ?? '',
                targetGroup: bookmark.targetGroup ?? '',
                tags: bookmark.tags ?? ''
              } as Scheme;
            }

            return undefined;
          })
          .filter((scheme): scheme is Scheme => !!scheme && !!scheme.id);

        const merged = [...remoteSaved, ...localSaved, ...fallbackSaved].filter(
          (scheme, index, all) => all.findIndex((item) => item.id === scheme.id) === index
        );

        return merged.length ? merged : [...localSaved, ...fallbackSaved];
      }),
      catchError(() => of([...localSaved, ...fallbackSaved]))
    );
  }

  saveScheme(userId: number, schemeId: number): Observable<unknown> {
    const currentIds = this.readSavedSchemeIds(userId);
    const nextIds = [...new Set([...currentIds, schemeId])];
    this.persistSavedSchemeIds(userId, nextIds);

    return this.http.post(`${this.baseUrl}/api/bookmarks`, { userId, schemeId }).pipe(
      catchError((error) => {
        const message = typeof error?.error?.message === 'string' ? error.error.message : '';
        if (message.toLowerCase().includes('already saved')) {
          return of({ success: true, savedLocally: true, alreadySaved: true });
        }
        return of({ success: true, savedLocally: true });
      })
    );
  }

  removeSavedScheme(userId: number, schemeId: number): Observable<unknown> {
    const currentIds = this.readSavedSchemeIds(userId).filter((id) => id !== schemeId);
    this.persistSavedSchemeIds(userId, currentIds);

    return this.http.delete(`${this.baseUrl}/api/bookmarks/user/${userId}/scheme/${schemeId}`).pipe(
      catchError(() => of({ success: true, removedLocally: true }))
    );
  }
}
