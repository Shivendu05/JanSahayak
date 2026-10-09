import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page.component';
import { SchemesPageComponent } from './pages/schemes-page.component';
import { SchemeDetailPageComponent } from './pages/scheme-detail-page.component';
import { VideosPageComponent } from './pages/videos-page.component';
import { ResourcesPageComponent } from './pages/resources-page.component';
import { LoginPageComponent } from './pages/login-page.component';
import { RegisterPageComponent } from './pages/register-page.component';
import { SavedPageComponent } from './pages/saved-page.component';
import { AdminPageComponent } from './pages/admin-page.component';
import { adminGuard, citizenGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'schemes', component: SchemesPageComponent },
  { path: 'schemes/:id', component: SchemeDetailPageComponent },
  { path: 'videos', component: VideosPageComponent },
  { path: 'resources', component: ResourcesPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'admin-login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'saved', component: SavedPageComponent, canActivate: [citizenGuard] },
  { path: 'admin', component: AdminPageComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
