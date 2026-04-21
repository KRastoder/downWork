# Backend API Documentation

---

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
    "role": "client | freelancer"
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
    "role": "freelancer | client"
  }
}

---

## User Routes

### GET /api/user/getUser/:id
Returns user by id.

Response:
{
  "user": {
    "id": number,
    "name": "string",
    "email": "string",
    "role": "client | freelancer"
  }
}

---

### GET /api/user/my-user-profile
Returns logged-in user.

Headers:
Authorization: Bearer <token>

Response:
{
  "user": {
    "id": number,
    "name": "string",
    "email": "string",
    "role": "client | freelancer"
  }
}

---

## Job Routes

### POST /api/jobs/create-job
Creates a job (client only).

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
Returns a single job.

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

### GET /api/jobs/all-jobs
Returns all jobs with recruiter name.

Response:
{
  "jobs": [
    {
      "id": number,
      "title": "string",
      "description": "string",
      "budget": number,
      "avalability": boolean,
      "recruiterName": "string"
    }
  ]
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

## Proposal Routes

### POST /api/jobs/proposals/:jobId
Creates proposal (freelancer only).

Headers:
Authorization: Bearer <token>

Body:
{
  "bid": number,
  "estimatedDays": number,
  "coverLetter": "string"
}

Response:
{
  "msg": "Proposal created",
  "proposal": {}
}

---

### GET /api/jobs/my-proposals/:jobId
Gets proposals for a job.

Headers:
Authorization: Bearer <token>

Response:
{
  "proposals": []
}

---

## Contract Routes

### POST /api/jobs/contracts
Creates contract from proposal (client only).

Headers:
Authorization: Bearer <token>

Body:
{
  "proposalId": number
}

Response:
{
  "msg": "Contract created",
  "contract": {
    "id": number,
    "jobId": number,
    "proposalId": number
  }
}

---

### GET /api/jobs/contracts/:id
Returns full contract details.

Response:
{
  "contract": {},
  "job": {},
  "proposal": {}
}

---

### GET /api/jobs/contracts
Returns all contracts for logged-in user (client or freelancer).

Response:
{
  "contracts": []
}