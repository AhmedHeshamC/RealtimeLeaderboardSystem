# Real-time Leaderboard Backend - By Ahmed Hesham

A backend system for real-time leaderboards, supporting user authentication, score submission, and live ranking updates for multiple games. Built with Node.js, TypeScript, Express, and PostgreSQL.

---

## Tech Stack

- **Node.js** (TypeScript): Backend runtime and language.
- **Express**: HTTP server and routing.
- **PostgreSQL**: Relational database with advanced ranking and real-time features.
- **bcrypt**: Secure password hashing.
- **jsonwebtoken (JWT)**: Stateless authentication.
- **dotenv**: Environment variable management.
- **ws**: WebSocket server for real-time updates.

---

## Features

- User registration and login with secure password storage.
- JWT-based authentication for protected endpoints.
- Score submission for multiple games.
- Global and per-game leaderboards with efficient SQL ranking.
- User-specific ranking queries.
- Top players report for a date range.
- Real-time leaderboard updates via PostgreSQL NOTIFY and WebSocket.
- Extensible for new games and analytics.

---

## API Endpoints

### Auth

- `POST /api/v1/auth/register`
  - Body: `{ "username": string, "password": string }`
  - Registers a new user.

- `POST /api/v1/auth/login`
  - Body: `{ "username": string, "password": string }`
  - Returns: `{ token, user }`
  - Logs in and returns a JWT.

### Scores

- `POST /api/v1/scores/submit`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "gameId": number, "score": number }`
  - Submits a score for a game.

- `GET /api/v1/scores/history`
  - Headers: `Authorization: Bearer <token>`
  - Returns the authenticated user's score history.

### Leaderboard

- `GET /api/v1/leaderboard/global`
  - Query: `?limit=100&offset=0&username=alice`
  - Returns the global leaderboard.

- `GET /api/v1/leaderboard/game/:gameId`
  - Query: `?limit=100&offset=0&username=alice`
  - Returns leaderboard for a specific game.

- `GET /api/v1/leaderboard/rank/:gameId`
  - Headers: `Authorization: Bearer <token>`
  - Returns the authenticated user's rank in a game.

- `GET /api/v1/leaderboard/top-players?from=YYYY-MM-DD&to=YYYY-MM-DD`
  - Returns top players for a date range.

---

## Real-Time Updates

- The backend uses PostgreSQL’s `LISTEN/NOTIFY` to detect new score submissions.
- A WebSocket server (`ws://<host>:<port>`) broadcasts leaderboard updates to all connected clients.
- Frontend clients can connect to the WebSocket to receive real-time leaderboard changes.

**Frontend Example (JavaScript):**
```js
const ws = new WebSocket('ws://localhost:3000');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'leaderboard') {
    // Update leaderboard UI
    renderLeaderboard(data.leaderboard);
  }
};
```

---

## Authentication (Frontend Usage)

- After login, store the JWT token (e.g., in localStorage).
- For protected endpoints, include the token in the `Authorization` header:
  ```
  Authorization: Bearer <token>
  ```

---

## Database Schema

- See `schema.sql` for full table definitions.
- Indexed for efficient leaderboard queries.
- Triggers and NOTIFY for real-time updates.

---

## Environment Variables

Create a `.env` file:
```
PORT=3000
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=leaderboarddb
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

---

## Running the Application

1. Install dependencies:
   ```
   npm install
   ```
2. Set up PostgreSQL and run the schema in `schema.sql`.
3. (Optional) Seed the database:
   ```
   npx ts-node src/seed.ts
   ```
4. Start the server:
   ```
   npm run dev
   ```

---

## Extending & Customizing

- Add new games by inserting into the `games` table.
- Add analytics or user profile endpoints as needed.
- Secure endpoints and sensitive data as per best practices.

---

## Security

- Passwords are hashed with bcrypt.
- JWT tokens for stateless authentication.
- Sensitive data is never exposed in API responses.

---

## License

MIT

---

## Project URLs
- GitHub: [(https://github.com/AhmedHeshamC/RealtimeLeaderboardSystem)]
- https://roadmap.sh/projects/realtime-leaderboard-system
