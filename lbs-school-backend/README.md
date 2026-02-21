# LBS School Backend

REST API for the LBS Public School website — built with Node.js, Express, MongoDB (Mongoose), JWT, and Cloudinary.

## Folder Structure

```
lbs-school-backend/
├── public/
│   └── temp/               ← multer temp uploads (auto-cleaned)
├── src/
│   ├── constants.js        ← DB_NAME
│   ├── index.js            ← Entry point (connect DB → start server)
│   ├── app.js              ← Express app setup, routes
│   ├── db/
│   │   └── index.js        ← Mongoose connect
│   ├── models/
│   │   ├── user.models.js
│   │   ├── student.models.js
│   │   ├── admission.models.js
│   │   ├── notice.models.js
│   │   └── event.models.js
│   ├── controllers/
│   │   ├── healthcheck.controller.js
│   │   ├── user.controller.js
│   │   ├── student.controller.js
│   │   ├── admission.controller.js
│   │   ├── notice.controller.js
│   │   └── event.controller.js
│   ├── routers/
│   │   ├── healthcheck.routes.js
│   │   ├── user.routes.js
│   │   ├── student.routes.js
│   │   ├── admission.routes.js
│   │   ├── notice.routes.js
│   │   └── event.routes.js
│   ├── middlewares/
│   │   ├── auth.middleware.js     ← JWT verifyJWT
│   │   ├── error.middlewares.js   ← Global error handler
│   │   └── multer.middleware.js   ← File uploads
│   └── utils/
│       ├── ApiError.js
│       ├── ApiResponse.js
│       ├── asyncHandler.js
│       └── cloudinary.js
├── .env                    ← Fill in your secrets (NOT committed)
├── .env.sample             ← Template
├── .prettierrc
└── package.json
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/v1/healthcheck` | No | Server health check |
| POST | `/api/v1/users/register` | No | Register user (avatar upload) |
| POST | `/api/v1/users/login` | No | Login → sets cookies |
| POST | `/api/v1/users/logout` | ✅ | Logout, clear cookies |
| POST | `/api/v1/users/refresh-token` | No | Refresh access token |
| GET | `/api/v1/users/me` | ✅ | Get current user |
| GET | `/api/v1/students` | ✅ | List students (filter by class/section) |
| POST | `/api/v1/students` | ✅ | Create student |
| GET | `/api/v1/students/:id` | ✅ | Get student by ID |
| PATCH | `/api/v1/students/:id` | ✅ | Update student |
| DELETE | `/api/v1/students/:id` | ✅ | Delete student |
| POST | `/api/v1/admissions` | No | Submit admission form |
| GET | `/api/v1/admissions` | ✅ | List all admissions |
| GET | `/api/v1/admissions/:id` | ✅ | Get admission by ID |
| PATCH | `/api/v1/admissions/:id/status` | ✅ | Approve / Reject |
| GET | `/api/v1/notices` | No | List notices |
| POST | `/api/v1/notices` | ✅ | Create notice |
| GET | `/api/v1/notices/:id` | No | Get notice by ID |
| PATCH | `/api/v1/notices/:id` | ✅ | Update notice |
| DELETE | `/api/v1/notices/:id` | ✅ | Delete notice |
| GET | `/api/v1/events` | No | List events |
| POST | `/api/v1/events` | ✅ | Create event |
| GET | `/api/v1/events/:id` | No | Get event by ID |
| PATCH | `/api/v1/events/:id` | ✅ | Update event |
| POST | `/api/v1/events/:id/register` | ✅ | Register for event |
| DELETE | `/api/v1/events/:id` | ✅ | Delete event |

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your credentials
copy .env.sample .env

# 3. Run in development mode
npm run dev

# 4. Run in production
npm start
```

## Tech Stack

- **Node.js** + **Express 5**
- **MongoDB** + **Mongoose 9**
- **JWT** for authentication
- **Cloudinary** for file storage
- **Multer** for file uploads
- **bcryptjs** for password hashing
- **dotenv**, **cors**, **cookie-parser**
