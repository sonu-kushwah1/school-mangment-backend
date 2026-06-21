# School Management API

**Base URL:** `http://localhost:5001`

**Headers (all JSON requests):**
```
Content-Type: application/json
```

**Protected routes** need:
```
Authorization: Bearer <token_from_login>
```

---

## Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Server status — returns `API Running...` |

---

## Auth — `/api/auth`

### Register
`POST /api/auth/register`

```json
{
  "fname": "Admin User",
  "email": "admin@school.com",
  "phone": "9876543210",
  "role": "admin",
  "password": "password123"
}
```

### Login
`POST /api/auth/login`

```json
{
  "email": "admin@school.com",
  "password": "password123"
}
```

**Response:** `{ "message", "token", "user": { id, fname, email, phone, role } }`

### Profile (protected)
`GET /api/auth/profile`

### Update Profile (protected)
`PUT /api/auth/profile`

### Get All Users (protected)
`GET /api/auth/users`

### Update User by ID (protected)
`PUT /api/auth/user/:id`

### Delete User by ID (protected)
`DELETE /api/auth/user/:id`

---

## Employees — `/api/emp`

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/api/emp` | — |
| POST | `/api/emp` | `{ "name", "email", "course", "age" }` |
| PUT | `/api/emp/:id` | `{ "name", "email", "course", "age" }` |
| DELETE | `/api/emp/:id` | — |

---

## Students — `/api/student`

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/api/student` | — |
| GET | `/api/student/:id` | — |
| POST | `/api/student` | See below |
| PUT | `/api/student/:id` | Same fields as create |
| DELETE | `/api/student/:id` | — |

**Create / update body:**
```json
{
  "first_name": "Rahul",
  "last_name": "Sharma",
  "gender": "Male",
  "mob_no": "9876543210",
  "dob": "2010-05-15",
  "blood_group": "B+",
  "religion": "Hindu",
  "class_name": "10",
  "email": "rahul@school.com",
  "section": "A",
  "fees": 5000
}
```
Required: None

---

## Users — `/api/user`

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/api/user` | — |
| POST | `/api/user` | `{ "name", "email", "phone" }` |
| PUT | `/api/user/:id` | `{ "name", "email", "phone" }` |
| DELETE | `/api/user/:id` | — |

---

## Classes — `/api/class`

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/api/class` | — |
| GET | `/api/class/:id` | — |
| POST | `/api/class` | `{ "className": "Class 10" }` |
| PUT | `/api/class/:id` | `{ "className": "Class 10" }` |
| DELETE | `/api/class/:id` | — |

---

## Fees — `/api/fees`

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/api/fees` | — |
| GET | `/api/fees/:id` | — |
| POST | `/api/fees` | `{ "className": "Class 10", "fees": 15000 }` |
| PUT | `/api/fees/:id` | `{ "className", "fees" }` |
| DELETE | `/api/fees/:id` | — |

---

## Transport — `/api/transport`

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/api/transport` | — |
| POST | `/api/transport` | See below |
| PUT | `/api/transport/:id` | Same fields |
| DELETE | `/api/transport/:id` | — |

**Create / update body:**
```json
{
  "routeName": "Route A",
  "vehicleNo": "DL-01-AB-1234",
  "driverName": "Suresh Kumar",
  "licenseNo": "DL1234567890",
  "phoneNo": "9876543210"
}
```
Required: `routeName`, `vehicleNo`, `driverName`

---

## Quick test (PowerShell)

```powershell
# Health
Invoke-RestMethod http://localhost:5001/

# Register
Invoke-RestMethod -Method POST -Uri http://localhost:5001/api/auth/register `
  -ContentType "application/json" `
  -Body '{"fname":"Admin","email":"admin@test.com","phone":"9999999999","role":"admin","password":"123456"}'

# Login
$login = Invoke-RestMethod -Method POST -Uri http://localhost:5001/api/auth/login `
  -ContentType "application/json" `
  -Body '{"email":"admin@test.com","password":"123456"}'

# Profile
Invoke-RestMethod -Uri http://localhost:5001/api/auth/profile `
  -Headers @{ Authorization = "Bearer $($login.token)" }

# All students
Invoke-RestMethod http://localhost:5001/api/student
```

---

## Setup

1. MySQL mein `student_db` database banao.
2. `database/schema.sql` run karo (tables create).
3. `.env` check karo (`PORT`, `JWT_SECRET`, DB credentials).
4. `npm run dev` — server `http://localhost:5001` par.
