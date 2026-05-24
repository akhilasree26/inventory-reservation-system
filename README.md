# Inventory Reservation System

A real-time inventory reservation system built using Next.js, Prisma, PostgreSQL (Supabase), and Vercel deployment.

---

# Live Demo

https://inventory-reservation-system-indol.vercel.app

---

# GitHub Repository

https://github.com/akhilasree26/inventory-reservation-system

---

# Features

- Product listing with warehouse inventory
- Real-time inventory tracking
- Reserve inventory items
- Confirm reservation flow
- Cancel reservation flow
- Automatic inventory release after expiry
- REST API architecture
- Professional responsive UI
- Prisma ORM with PostgreSQL
- Deployed on Vercel

---

# Tech Stack

- Next.js 16
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- Vercel

---

# API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get products with stock details |
| GET | `/api/warehouses` | Get all warehouses |
| POST | `/api/reservations` | Create reservation |
| POST | `/api/reservations/:id/confirm` | Confirm reservation |
| POST | `/api/reservations/:id/release` | Cancel/release reservation |

---

# Local Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/akhilasree26/inventory-reservation-system.git
cd inventory-reservation-system
````

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root.

Add the following:

```env
DATABASE_URL=your_supabase_database_url
DIRECT_URL=your_supabase_database_url
```

Example:

```env
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.xxxxx:password@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

---

## 4. Run Prisma Migration

```bash
npx prisma migrate dev
```

---

## 5. Seed Database

```bash
npx prisma db seed
```

---

## 6. Generate Prisma Client

```bash
npx prisma generate
```

---

## 7. Start Development Server

```bash
npm run dev
```

Application will run on:

```txt
http://localhost:3000
```

---

# Reservation Expiry Mechanism

When a reservation is created:

* Reserved stock is deducted immediately from available inventory.
* Every reservation receives an `expiresAt` timestamp.
* If user confirms before expiry:

  * Reservation status becomes `CONFIRMED`
  * Reserved stock remains allocated.
* If reservation is cancelled:

  * Reserved stock is restored.
  * Reservation status becomes `RELEASED`.
* If reservation expires:

  * API returns HTTP `410 Gone`
  * Reserved stock is automatically restored.

This prevents overselling and keeps inventory consistent.

---

# Error Handling

## 409 Conflict

Returned when:

* Requested stock quantity exceeds available inventory.

## 410 Gone

Returned when:

* Reservation has expired.

Both errors are displayed in the frontend UI.

---

# Production Deployment

Frontend and APIs are deployed on Vercel.

Database is hosted on Supabase PostgreSQL.

Environment Variables configured in Vercel:

```env
DATABASE_URL
DIRECT_URL
```


# Trade-offs / Future Improvements

With more time, the following improvements can be added:

* Redis-based distributed reservation locking
* Background cron jobs for expiry cleanup
* User authentication system
* Reservation analytics dashboard
* Automated testing
* Docker support
* Better loading states and animations
* Search and filtering
* Pagination
* API rate limiting and security improvements

---

# Author

Akhila Sree Menda
