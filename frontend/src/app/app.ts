import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  currentUser: { name: string; role: string } | null = null;

  constructor(private router: Router, private apiService: ApiService) {
    this.syncCurrentUser();
    window.addEventListener('storage', this.handleSessionUpdate);
    window.addEventListener('user-session-changed', this.handleSessionUpdate);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleSessionUpdate);
    window.removeEventListener('user-session-changed', this.handleSessionUpdate);
  }

  private readonly handleSessionUpdate = (): void => {
    this.syncCurrentUser();
  };

  private syncCurrentUser(): void {
    const saved = localStorage.getItem('user');
    this.currentUser = saved ? JSON.parse(saved) : null;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  logout(): void {
    const clearSession = (): void => {
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('user-session-changed'));
      this.router.navigateByUrl('/');
    };
    this.apiService.logout().subscribe({ next: clearSession, error: clearSession });
  }
}
