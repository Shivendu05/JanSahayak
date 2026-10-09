# Jan Sahayak

Jan Sahayak is a beginner-friendly welfare portal for Indian citizens. It helps users discover useful government schemes, eligibility information, official portals, videos, and support resources from one simple dashboard.

## Verified project status

The project was validated locally with fresh evidence:

- Backend responds successfully on `http://localhost:8081/api/schemes`
- Angular app compiles successfully with `npm run build`
- The scheme detail page renders correctly at `http://localhost:4201/schemes/1`

## Tech stack

- Java 21
- Spring Boot 4.0.0
- Spring Web
- Spring Data JPA
- Spring Security with BCrypt
- H2 database for local development
- PostgreSQL-ready structure for future database migration
- Angular 21
- TypeScript, HTML, CSS
- Maven

## Main features

- Home page with a professional hero section and quick access links
- Government scheme listing with search and filters
- Scheme detail page with eligibility, benefits, documents, and official application links
- Videos page with useful awareness resources
- Resources page with official government portals and support links
- Separate citizen and administrator sign-in
- Save/bookmark scheme feature for authenticated users
- Admin-only scheme, video, and resource management enforced by Spring Security
- Clean, beginner-friendly layered architecture

## Final folder structure

```text
jan_sahayak/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── mvnw
├── frontend/
│   ├── src/
│   ├── package.json
│   └── angular.json
├── README.md
├── VIVA_GUIDE.md
└── .gitignore
```

## Project architecture

The backend follows a standard beginner-friendly Spring Boot structure:

- Controller → handles API requests
- Service → contains business logic
- Repository → interacts with the database
- Entity → represents Java model classes

This structure is simple enough to explain clearly in a viva or college presentation.

## Database setup

By default, the application uses H2 in-memory storage for local development. This makes it easy to run without extra setup.

For hosted PostgreSQL, set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DRIVER=org.postgresql.Driver`, and `DB_DIALECT=org.hibernate.dialect.PostgreSQLDialect`. Set `FRONTEND_ORIGIN` to the deployed frontend origin so cookie-based sessions can be used across the app. Route the frontend's `/api` requests to the backend with a same-origin reverse proxy. Store real values only in your hosting provider's secret/environment settings; `.env.example` contains placeholders only. Never commit database credentials. If a real credential was committed previously, rotate it in the database provider and update the deployment secret.

The backend creates an administrator account only when both `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set. The password is stored as a BCrypt hash. Do not use a shared default administrator password in a hosted environment.

## Environment and runtime ports

Working local setup used in this project:

- Backend: `http://localhost:8081`
- Frontend: `http://localhost:4201`

> Port 8080 and 4200 were already occupied in the current environment, so the app was configured to use 8081 and 4201.

## Run the project

### 1) Start the backend

```bash
cd c:/7th sem/jan_sahayak/backend
./mvnw spring-boot:run
```

### 2) Start the frontend

```bash
cd c:/7th sem/jan_sahayak/frontend
npm install
npx ng serve --host 0.0.0.0 --port 4201
```

### 3) Open the app

```text
http://localhost:4201
```

## Administrator setup

Set these environment variables before starting the backend to create the first administrator account:

```text
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-strong-password
```

Citizens create accounts through the registration page and sign in at `/login`. Administrators sign in separately at `/admin-login`. Public visitors may browse schemes, videos, and resources; only administrators can create, update, or delete portal content. Bookmark actions require a signed-in citizen and are limited to that citizen's own account.

## API overview

The backend exposes these main API groups:

- `GET /api/schemes` → list all schemes
- `GET /api/schemes/{id}` → get a specific scheme by ID
- `GET /api/schemes/search?keyword=...` → search schemes
- `GET /api/videos` → list educational videos
- `GET /api/resources` → list official government resources
- `POST /api/auth/register` → register a user
- `POST /api/auth/login/user` → create a citizen session
- `POST /api/auth/login/admin` → create an administrator session
- `POST /api/auth/logout` → end the session
- `GET /api/bookmarks/user/{userId}` → get saved schemes
- `POST /api/bookmarks` → save a scheme for a user
- `GET /api/dashboard` → administrator-only dashboard stats
- `POST`, `PUT`, `DELETE /api/schemes/**`, `/api/videos/**`, `/api/resources/**` → administrator-only content management

## Notes

- The app intentionally avoids unnecessary complexity and advanced architecture.
- It is meant to be easy to explain in a viva and easy to extend in future semester projects.
- The scheme detail blank-screen issue was fixed by making the route page safe when data is missing or invalid.
- The app remains beginner-friendly while still looking professional.

## Suggested demo flow

1. Open the home page.
2. Click “Explore schemes”.
3. Search or filter by category.
4. Open a scheme detail page.
5. Click the official portal link.
6. Sign in as a citizen to save schemes, or as an administrator to manage portal content.

## Remaining notes

- H2 is used for quick local development.
- H2 is in-memory for local development; hosted deployments should use persistent PostgreSQL.
- The project is intentionally simple and educational rather than enterprise-scale.
