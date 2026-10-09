import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-shell">
      <div class="auth-hero">
        <span class="badge">Citizen-first platform</span>
        <h1>Welcome back to Jan Sahayak</h1>
        <p>
          Discover welfare schemes, useful resources, and government support programs in one simple,
          trustworthy place.
        </p>

        <div class="feature-list">
          <div class="feature-item" *ngFor="let feature of featureHighlights">
            <span class="feature-icon">{{ feature.icon }}</span>
            <div>
              <strong>{{ feature.title }}</strong>
              <small>{{ feature.description }}</small>
            </div>
          </div>
        </div>
      </div>

      <div class="auth-panel">
        <div class="auth-header">
          <span class="mini-tag">{{ role === 'ADMIN' ? 'Administrator access' : 'Citizen access' }}</span>
          <h2>{{ role === 'ADMIN' ? 'Admin sign in' : 'Citizen sign in' }}</h2>
        </div>

        <form class="auth-form" (ngSubmit)="login()">
          <label>
            Email
            <input type="email" [(ngModel)]="email" placeholder="Enter your email" name="email" required />
          </label>
          <label>
            Password
            <input type="password" [(ngModel)]="password" placeholder="Enter your password" name="password" required />
          </label>
          <button type="submit" class="primary-btn" [disabled]="isSubmitting">
            {{ isSubmitting ? 'Signing in...' : 'Login' }}
          </button>
        </form>

        <p class="auth-error" *ngIf="errorMessage">{{ errorMessage }}</p>
        <p class="auth-link" *ngIf="role === 'USER'">New here? <a routerLink="/register">Create a citizen account</a></p>
        <p class="auth-link" *ngIf="role === 'USER'">Administrator? <a routerLink="/admin-login">Admin sign in</a></p>
        <p class="auth-link" *ngIf="role === 'ADMIN'"><a routerLink="/login">Return to citizen sign in</a></p>
      </div>
    </section>
  `,
  styles: ['']
})
export class LoginPageComponent {
  email = '';
  password = '';
  isSubmitting = false;
  errorMessage = '';
  role: 'USER' | 'ADMIN' = 'USER';

  featureHighlights = [
    { icon: '🏛️', title: 'Government schemes', description: 'Browse support programs by category and need.' },
    { icon: '📚', title: 'Helpful resources', description: 'Access trusted portals, scholarship links, and guides.' },
    { icon: '🔒', title: 'Simple access', description: 'Login quickly and save schemes for later review.' }
  ];

  constructor(private apiService: ApiService, private router: Router, route: ActivatedRoute) {
    this.role = route.snapshot.routeConfig?.path === 'admin-login' ? 'ADMIN' : 'USER';
  }

  login(): void {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.apiService.login({ email: this.email, password: this.password }, this.role).subscribe({
      next: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event('user-session-changed'));
        this.isSubmitting = false;
        this.router.navigateByUrl(user.role === 'ADMIN' ? '/admin' : '/schemes');
      },
      error: () => {
        this.errorMessage = 'Unable to sign in with those credentials.';
        this.isSubmitting = false;
      }
    });
  }
}
