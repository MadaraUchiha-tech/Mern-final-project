# Forum Server

- Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
- Run: `npm run dev`

API
- POST /api/auth/register
- POST /api/auth/login
- GET /api/posts
- GET /api/posts/:id
- POST /api/posts
- PATCH /api/posts/:id/like
- POST /api/posts/:id/reply
- PATCH /api/posts/:postId/replies/:replyId/like
- DELETE /api/posts/:id
