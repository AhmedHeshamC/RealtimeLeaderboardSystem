# Real-time Leaderboard API Design

## Overview
This document describes the design of a real-time leaderboard backend system. The system allows users to register, log in, submit scores for various games, and view real-time leaderboards and rankings. It is built with Node.js (TypeScript), Express, and PostgreSQL, leveraging advanced SQL features for efficient ranking and real-time updates.

---

## Architecture
- **Backend:** Node.js (TypeScript) with Express
- **Database:** PostgreSQL (with LISTEN/NOTIFY for real-time updates)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Environment Variables:** dotenv

---

## Folder Structure
```
/rls
├── src/
│   ├── app.ts
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── db/
│   ├── utils/
│   └── types/
├── schema.sql
├── package.json
├── tsconfig.json
└── README.md
```

---

## Database Schema
- **users**: Stores user accounts
- **games**: Stores game definitions
- **scores**: Stores score submissions

See `schema.sql` for full DDL.

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Log in and receive JWT

### Scores
- `POST /api/scores/submit` — Submit a score for a game (auth required)
- `GET /api/scores/history` — Get score history for the authenticated user

### Leaderboard
- `GET /api/leaderboard/global` — Get global leaderboard (top users across all games)
- `GET /api/leaderboard/game/:gameId` — Get leaderboard for a specific game
- `GET /api/leaderboard/rank/:gameId` — Get the authenticated user's rank in a game
- `GET /api/leaderboard/top-players?from=YYYY-MM-DD&to=YYYY-MM-DD` — Get top players for a period

---

## Core Features

### 1. User Authentication
- Registration and login with hashed passwords (bcrypt)
- JWT-based authentication for protected endpoints

### 2. Score Submission
- Users submit scores for specific games
- Each submission triggers a NOTIFY for real-time updates

### 3. Leaderboard & Rankings
- Global and per-game leaderboards using SQL window functions (RANK, ROW_NUMBER)
- Efficient queries with proper indexes
- User can view their own rank

### 4. Top Players Report
- Query top players for a given period (date range)

### 5. Real-Time Updates
- Backend listens to PostgreSQL NOTIFY events
- (Optional) WebSocket or SSE endpoint for clients to receive real-time leaderboard updates

---

## Security
- Passwords are hashed with bcrypt
- JWT tokens are used for authentication
- Sensitive data is never exposed in API responses

---

## Example SQL Queries
- See `schema.sql` for table definitions and example queries for leaderboards and rankings

---

## Extensibility
- Add more games by inserting into the `games` table
- Add more endpoints for analytics or user profiles as needed

---

## Environment Variables (.env)
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

## Future Improvements
- Add email verification
- Add password reset
- Add admin endpoints for moderation
- Add caching for leaderboard endpoints
- Add rate limiting

---

## References
- See `R.md` for requirements
- See `schema.sql` for database schema
