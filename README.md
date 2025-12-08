# Agrolink – Fullstack Laravel + React Application

Agrolink is a full-stack web application designed for managing agriculture-related data.
It uses Laravel to build a robust backend API and React to deliver a modern, responsive frontend single-page application (SPA).

---

## Features

- Modern agriculture data management system  
- Authentication and role-based access  
- RESTful Laravel API  
- React Single Page Application  
- Smooth API communication using Axios  
- Clean and responsive UI  
- MySQL database support  

---

## Project Structure

```
Agrolink/
│
├── agrolink-backend/    # Laravel Backend (API)
│   ├── app/
│   ├── routes/
│   ├── database/
│   └── vendor/ (ignored)
│
└── agrolink-frontend/   # React Frontend
    ├── src/
    ├── public/
    └── node_modules/ (ignored)
```

---

## Technologies Used

| Layer     | Technology                         |
|-----------|-------------------------------------|
| Frontend  | React, JSX, Vite/CRA, Axios         |
| Backend   | Laravel 10+, PHP 8+                 |
| Database  | MySQL / MariaDB                     |
| Server    | Apache (XAMPP), PHP                 |
| Tools     | Git, GitHub, Composer, NPM          |

---

## Backend Setup (Laravel)

```bash
cd agrolink-backend

composer install
cp .env.example .env
php artisan key:generate

# Database migrate
php artisan migrate

# Local development server
php artisan serve
```

---

## Frontend Setup (React)

```bash
cd agrolink-frontend

npm install
npm run dev
```

---

## API Endpoint Structure (Example)

| Method | Endpoint              | Description            |
|--------|------------------------|------------------------|
| GET    | /api/products         | List all products      |
| POST   | /api/products         | Create new product     |
| PUT    | /api/products/{id}    | Update product         |
| DELETE | /api/products/{id}    | Delete product         |

---

## Environment Variables

### Laravel
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=agrolink_db
DB_USERNAME=root
DB_PASSWORD=
```

### React
```
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## Available Scripts

### Backend
```
php artisan serve
php artisan migrate
php artisan tinker
```

### Frontend
```
npm run dev
npm run build
npm run preview
```

---

## Production Build (React)

```bash
cd agrolink-frontend
npm run build
```

The production build will be located in the `dist/` directory.

---

## Author

Journey To Zero  
GitHub: https://github.com/journeytozero
