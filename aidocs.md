# Backend API Documentation

## Auth Routes

### POST /api/auth/register
Creates a new user.

Body:
{
  "name": "string",
  "email": "string",
  "password": "string (min 6 chars)",
  "role": "client" | "freelancer"
}

Response:
{
  "msg": "success",
  "user": {
    "id": number,
    "name": "string",
    "email": "string",
    "role": "client" | "freelancer"
  }
}

---

### POST /api/auth/login
Logs in a user and returns a JWT.

Body:
{
  "email": "string",
  "password": "string"
}

Response:
{
  "msg": "Login success",
  "user": {
    "id": number,
    "name": "string",
    "email": "string"
  },
  "token": "jwt_token"
}

---

### GET /api/auth/me
Returns the current authenticated user.

Headers:
Authorization: Bearer <token>

Response:
{
  "user": {
    "id": number,
    "name": "string",
    "role": "freelancer"
  }
}

---

## User Routes

### GET /api/user/getUser/:id
Returns a user by id.

Response:
{
  "user": {
    "id": number,
    "name": "string",
    "email": "string",
    "role": "client" | "freelancer"
  }
}

---

### GET /api/user/my-user-profile
Returns the logged-in user.

Headers:
Authorization: Bearer <token>

Response:
{
  "user": {
    "id": number,
    "name": "string",
    "email": "string",
    "role": "client" | "freelancer"
  }
}

---

## Job Routes

### POST /api/jobs/create-job
Creates a job.

Headers:
Authorization: Bearer <token>

Body:
{
  "title": "string",
  "description": "string",
  "budget": number
}

Response:
{
  "msg": "job created"
}

---

### GET /api/jobs/jobs/:id
Returns a job by id.

Response:
{
  "job": {
    "id": number,
    "title": "string",
    "description": "string",
    "budget": number,
    "recruiterId": number
  }
}

---

### DELETE /api/jobs/delete-jobs/:id
Deletes a job.

Headers:
Authorization: Bearer <token>

Response:
{
  "msg": "Job deleted"
}

---

### POST /api/jobs/proposals/:jobId
Creates a proposal for a job.

Headers:
Authorization: Bearer <token>

Body:
{
  "bid": number,
  "estimatedDays": number, "coverLetter": "string" }

Response:
{
  "msg": "Proposal created",
  "proposal": {}
}

---

### GET /api/jobs/my-proposals/:jobId
Gets all proposals for a job.

Headers:
Authorization: Bearer <token>

Response:
{
  "proposals": []
}