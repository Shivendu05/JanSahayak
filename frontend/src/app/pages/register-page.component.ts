import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-shell">
      <div class="auth-hero">
        <span class="badge">Create your account</span>
        <h1>Start exploring public welfare support</h1>
        <p>
          Save schemes, track important opportunities, and stay informed about government resources that
          may help you and your family.
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
          <span class="mini-tag">Register</span>
          <h2>Create account</h2>
        </div>

        <form class="auth-form" (ngSubmit)="register()">
          <label>
            Full name
            <input type="text" [(ngModel)]="name" placeholder="Enter your full name" name="name" required />
          </label>
          <label>
            Email
            <input type="email" [(ngModel)]="email" placeholder="Enter your email" name="email" required />
          </label>
          <label>
            Password
            <input type="password" [(ngModel)]="password" placeholder="Enter your password" name="password" required />
          </label>
          <button type="submit" class="primary-btn">Create account</button>
        </form>

        <p class="auth-link">Already have an account? <a routerLink="/login">Login</a></p>
      </div>
    </section>
  `,
  styles: ['']
})
export class RegisterPageComponent {
  name = '';
  email = '';
  password = '';

  featureHighlights = [
    { icon: '💡', title: 'Personalized browsing', description: 'Explore the schemes most relevant to your needs.' },
    { icon: '📌', title: 'Save for later', description: 'Bookmark helpful schemes and revisit them quickly.' },
    { icon: '🌍', title: 'Public access', description: 'Use a clean, informative portal with simple navigation.' }
  ];

  constructor(private apiService: ApiService, private router: Router) {}

  register(): void {
    this.apiService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: () => alert('Could not create the account. Check the details or try a different email.')
    });
  }
}
