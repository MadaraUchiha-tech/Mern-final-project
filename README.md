# MERN Forum App

Backend
- cd server
- Copy `.env.example` to `.env` and set MONGO_URI, JWT_SECRET, PORT.
- npm run dev

Frontend
- cd client
- Copy `.env.example` to `.env` (optional; defaults to http://localhost:5000/api)
- npm run dev

Available API endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/posts
- GET /api/posts/:id
- POST /api/posts
- PATCH /api/posts/:id/like
- POST /api/posts/:id/reply
- PATCH /api/posts/:postId/replies/:replyId/like
- DELETE /api/posts/:id
