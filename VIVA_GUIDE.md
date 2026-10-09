# Jan Sahayak Viva Guide

## 1. Project objective

Jan Sahayak is a public welfare portal designed to help citizens quickly discover government schemes, eligibility details, useful resources, and official links in one simple platform.

## 2. Problem it solves

Many people find it difficult to locate the right government scheme, understand the eligibility criteria, and find the official application page. This project brings those pieces together in a clean and beginner-friendly portal.

## 3. Technology stack

- Frontend: Angular, TypeScript, HTML, CSS
- Backend: Java, Spring Boot, Spring Web, Spring Data JPA
- Security: Spring Security with BCrypt password hashing
- Database: H2 for local development, with PostgreSQL-ready structure
- Build tool: Maven

## 4. Project structure

```text
jan_sahayak/
├── backend/
│   ├── src/main/java/com/jansahayak
│   ├── src/main/resources
│   ├── pom.xml
│   └── mvnw
├── frontend/
│   ├── src/app
│   ├── src/styles.css
│   ├── package.json
│   └── angular.json
├── README.md
├── VIVA_GUIDE.md
└── .gitignore
```

## 5. Architecture explanation

The app uses a classic layered architecture:

- Controller: receives HTTP requests
- Service: handles the business logic
- Repository: interacts with the database
- Entity: represents the stored data model

This is simple, standard, and easy to explain in a viva because it is a very common Spring Boot design pattern.

## 6. Key features

- Home page with hero section and quick access buttons
- Scheme listing page with search and filters
- Scheme detail page with eligibility, benefits, and applications
- Video section for awareness and guidance content
- Resource section with official government links
- User registration and login
- Save/bookmark support for welfare schemes
- Admin user for starter management and demo use
- Professional UI with a simple, clean layout

## 7. How the application works

1. The user opens the website.
2. They browse or search government schemes.
3. They click a scheme to view detailed eligibility and application details.
4. The Angular frontend calls Spring Boot REST APIs.
5. The backend fetches data from the database and returns JSON.
6. The frontend renders the data in a user-friendly format.

## 8. Security and data handling

- Passwords are protected using BCrypt.
- The backend uses a simple authentication flow.
- Local development uses H2 so the project is fast and easy to run.
- The app keeps its implementation simple and easy to understand.

## 9. Demo run instructions

### Backend

```bash
cd c:/7th sem/jan_sahayak/backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd c:/7th sem/jan_sahayak/frontend
npm install
npx ng serve --host 0.0.0.0 --port 4201
```

Open:

```text
http://localhost:4201
```

## 10. Admin credentials

- Email: `admin@jansahayak.com`
- Password: `admin123`

## 11. Sample viva questions and answers

### Q1. What is the purpose of your project?
A: It helps citizens discover welfare schemes and government support information in one simple portal.

### Q2. Why did you choose Spring Boot?
A: Because it helps build Java-based REST APIs quickly and cleanly with standard backend architecture.

### Q3. Why did you choose Angular?
A: Angular helps us build a modern single-page user interface with reusable components and professional page layouts.

### Q4. What is the role of the repository layer?
A: It handles database operations such as fetching schemes, saving users, and retrieving bookmarks.

### Q5. What is the role of the service layer?
A: It contains the application logic, such as validation, filtering, and scheme-related operations.

### Q6. Why is the project beginner-friendly?
A: The structure is simple, the code is easy to follow, and there are no unnecessary microservices or advanced technologies.

### Q7. How does the system display scheme details?
A: The frontend sends a request to the backend API, which returns scheme data, and Angular renders that data on the detail page.

### Q8. What was one issue you solved during development?
A: The scheme detail page could become blank when the route id was missing or invalid. I fixed it by adding fallback data and validation before rendering.

### Q9. Why is this project useful?
A: It makes public welfare information more accessible to citizens and helps them find support schemes in a structured way.

## 12. Final presentation tips

- Start with the real-world problem.
- Explain the purpose of the app clearly.
- Show the home page and schemes page.
- Explain the layered Spring Boot architecture simply.
- Mention that the project is beginner-friendly and easy to extend.
- End by saying the application is practical, useful, and suitable for a college project.

## 13. Short conclusion

Jan Sahayak is a practical, useful, and easy-to-understand project that combines government service discovery with modern web development. It is suitable for academic presentations because it is simple to explain, visually professional, and clearly demonstrates full-stack development in a real-world use case.
