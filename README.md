# ShopStack — Authentication & Product CRUD Platform

A full-stack e-commerce backend and frontend application built as part of the **Sheryians Coding School assignment**.

ShopStack demonstrates secure JWT-based authentication, access and refresh token handling, protected REST APIs, product CRUD operations, input validation, pagination, search, and a React frontend with a layered architecture.

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Express Validator
* Axios

### Frontend

* React
* Vite
* React Router
* Axios
* React Context API

---

## Project Architecture

The project is divided into separate backend and frontend applications.

### Backend Architecture

The backend follows an MVC-style structure with separate layers for models, controllers, routes, middleware, validators, and utilities.

```text
backend/
├── config/
│   └── db.js
│
├── models/
│   ├── User.js
│   └── Product.js
│
├── controllers/
│   ├── authController.js
│   └── productController.js
│
├── routes/
│   ├── authRoutes.js
│   └── productRoutes.js
│
├── middleware/
│   ├── authenticate.js
│   └── validationHandler.js
│
├── validators/
│   ├── authValidators.js
│   └── productValidators.js
│
├── utils/
│   ├── jwt.js
│   └── response.js
│
├── app.js
└── server.js
```

### Backend Responsibilities

| Directory     | Responsibility                        |
| ------------- | ------------------------------------- |
| `config`      | Database configuration and connection |
| `models`      | MongoDB schemas and data models       |
| `controllers` | Application and business logic        |
| `routes`      | API endpoint definitions              |
| `middleware`  | Authentication and request processing |
| `validators`  | Request body and parameter validation |
| `utils`       | JWT and API response utilities        |
| `app.js`      | Express application configuration     |
| `server.js`   | Application entry point               |

---

## Frontend Architecture

The frontend follows a four-layer architecture that separates API communication, state management, business logic, and presentation.

```text
frontend/src/
│
├── services/
│   ├── axiosInstance.js
│   ├── authService.js
│   └── productService.js
│
├── store/
│   └── AuthContext.jsx
│
├── hooks/
│   ├── useLoginForm.js
│   ├── useRegisterForm.js
│   ├── useProducts.js
│   └── useProductForm.js
│
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── FormField.jsx
│   └── ProductCard.jsx
│
└── pages/
    ├── LoginPage.jsx
    ├── RegisterPage.jsx
    ├── ProductsPage.jsx
    ├── ProductDetailPage.jsx
    └── ProductFormPage.jsx
```

### Frontend Layers

**Layer 1 — Data and API**

Handles communication with the backend through Axios.

* `axiosInstance.js` — Axios configuration and token refresh interceptor
* `authService.js` — Authentication API requests
* `productService.js` — Product API requests

**Layer 2 — State Management**

* `AuthContext.jsx` manages authentication state, user information, login, registration, and logout.

**Layer 3 — Business Logic**

Custom hooks handle form state, validation, API operations, product fetching, searching, pagination, and CRUD operations.

**Layer 4 — Presentation**

React components and pages are responsible for rendering the user interface and handling user interactions.

---

## Authentication Flow

ShopStack uses JWT-based authentication with separate access and refresh tokens.

```text
Register
   |
   v
POST /api/auth/register
   |
   v
User Account Created
   |
   v
Login
   |
   v
POST /api/auth/login
   |
   +--------------------------+
   |                          |
   v                          v
Access Token             Refresh Token
   |                          |
sessionStorage            HTTP-only Cookie
   |                          |
   v                          v
Authorization Header      Server-side Storage
Bearer <token>                 |
   |                           |
   +-------------+-------------+
                 |
                 v
          Protected APIs
```

### Token Handling

* Access tokens are short-lived and stored in `sessionStorage`.
* Access tokens are sent using the `Authorization: Bearer <token>` header.
* Refresh tokens are stored in HTTP-only cookies.
* Refresh tokens are also stored server-side to support revocation.
* When an access token expires, the Axios interceptor requests a new access token.
* Refresh token rotation is performed during token renewal.
* Logout invalidates the stored refresh token and clears the cookie.

---

## API Endpoints

### Authentication

| Method | Endpoint                  | Access        | Description                                         |
| ------ | ------------------------- | ------------- | --------------------------------------------------- |
| POST   | `/api/auth/register`      | Public        | Create a new user account                           |
| POST   | `/api/auth/login`         | Public        | Authenticate user and issue tokens                  |
| POST   | `/api/auth/refresh-token` | Public        | Generate a new access token using the refresh token |
| POST   | `/api/auth/logout`        | Authenticated | Invalidate the refresh token                        |
| GET    | `/api/auth/me`            | Authenticated | Get the currently authenticated user                |

### Products

| Method | Endpoint            | Access        | Description                             |
| ------ | ------------------- | ------------- | --------------------------------------- |
| GET    | `/api/products`     | Public        | Get products with pagination and search |
| GET    | `/api/products/:id` | Public        | Get a single product                    |
| POST   | `/api/products`     | Authenticated | Create a product                        |
| PUT    | `/api/products/:id` | Authenticated | Update a product                        |
| DELETE | `/api/products/:id` | Authenticated | Delete a product                        |

### Product Query Parameters

The product listing endpoint supports pagination and search.

```text
GET /api/products?page=1&limit=10&search=phone
```

| Parameter | Description                 |
| --------- | --------------------------- |
| `page`    | Page number                 |
| `limit`   | Number of products per page |
| `search`  | Search keyword              |

---

## Security Implementation

The application includes several security-focused practices:

* Passwords are hashed using bcrypt.
* Passwords are never stored or returned as plain text.
* JWT secrets are stored in environment variables.
* Access tokens have a short expiration period.
* Refresh tokens have a longer expiration period.
* Refresh tokens are stored server-side for revocation.
* Refresh tokens are sent using HTTP-only cookies.
* Cookies use secure and same-site configuration.
* Refresh token rotation is implemented.
* Authentication failures return generic error messages.
* Mongoose password fields use `select: false`.
* Express Validator validates request bodies and route parameters.
* Protected routes require a valid JWT access token.
* CORS is configured for the allowed frontend origin.
* Environment variables are excluded from version control.

---

## Validation

Request validation is implemented using `express-validator`.

Authentication validation includes:

* Name
* Email
* Password
* Confirm password

Product validation includes:

* Product fields
* Product ID parameters
* Required fields
* Invalid input handling

Validation errors are returned as structured HTTP 400 responses.

---

## Product Features

The product module supports:

* Create product
* View all products
* View product details
* Update product
* Delete product
* Search products
* Pagination
* Protected write operations
* Product creator reference

---

## Frontend Features

The React application provides:

* User registration
* User login
* User logout
* Authentication state management
* Protected routes
* Product listing
* Product search
* Product pagination
* Product details
* Product creation
* Product editing
* Product deletion
* Form validation
* Automatic access-token refresh
* Reusable form and product components

---

## Project Setup

### Prerequisites

Make sure the following are installed:

* Node.js 18 or later
* MongoDB or MongoDB Atlas
* npm

---

## Backend Setup

Clone the repository and navigate to the backend directory.

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`.

```env
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
PORT=5000
```

Start the development server:

```bash
npm run dev
```

Backend server:

```text
http://localhost:5000
```

---

## Frontend Setup

Open a new terminal and navigate to the frontend directory.

```bash
cd frontend
npm install
npm run dev
```

Frontend application:

```text
http://localhost:5173
```

---

## Environment Variables

The backend requires the following environment variables:

| Variable               | Purpose                            |
| ---------------------- | ---------------------------------- |
| `MONGO_URI`            | MongoDB connection string          |
| `ACCESS_TOKEN_SECRET`  | Secret used to sign access tokens  |
| `REFRESH_TOKEN_SECRET` | Secret used to sign refresh tokens |
| `PORT`                 | Backend server port                |

Never commit the `.env` file or expose JWT secrets in the repository.

---

## API Request Flow

### Login

```text
React Login Form
       |
       v
loginAPI()
       |
       v
POST /api/auth/login
       |
       v
Express Route
       |
       v
Validation
       |
       v
Auth Controller
       |
       v
Verify User Credentials
       |
       v
Generate JWT Tokens
       |
       +----------------------+
       |                      |
       v                      v
Access Token           Refresh Token
       |                      |
       v                      v
sessionStorage          HTTP-only Cookie
```

### Protected Product Request

```text
React Application
       |
       v
Axios Request
       |
       v
Authorization: Bearer <access-token>
       |
       v
Authentication Middleware
       |
       v
Verify JWT
       |
       v
Product Controller
       |
       v
MongoDB
       |
       v
API Response
```

### Token Refresh

```text
API Request
    |
    v
Access Token Expired
    |
    v
401 Response
    |
    v
Axios Interceptor
    |
    v
POST /api/auth/refresh-token
    |
    v
Verify Refresh Token
    |
    v
Generate New Access Token
    |
    v
Retry Original Request
```

---

## Deliverables

The project covers the following assignment requirements:

1. JWT-based authentication APIs
2. Access and refresh token implementation
3. Product CRUD APIs
4. Protected product write operations
5. Express Validator integration
6. Pagination and product search
7. React frontend application
8. Authentication state management
9. Protected frontend routes
10. Automatic access-token refresh
11. Layered frontend architecture
12. MongoDB database integration

---

## Learning Outcomes

Through this project, the following concepts are demonstrated:

* REST API development with Node.js and Express
* JWT authentication
* Access and refresh token architecture
* HTTP-only cookies
* Authentication middleware
* Password hashing with bcrypt
* MongoDB and Mongoose
* Express request validation
* CRUD API development
* API pagination and search
* Axios interceptors
* React Context API
* Custom React hooks
* Protected routes
* Separation of concerns
* Layered application architecture

---

## License

This project was developed for educational and assignment purposes.
