# Fractio Dashboard

## Overview

Fractio is a web dashboard for managing fractional ownership and asset tracking. The dashboard provides a clean, responsive interface for users to view portfolio data, monitor asset performance, manage ownership shares, and review transaction history.

## Technologies Used

- **Frontend**
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - React Router
  - Recharts / Chart.js (for charts and data visualization)
- **Backend**
  - Node.js
  - Express
  - REST API or GraphQL API
- **Database**
  - PostgreSQL or MySQL
  - Prisma or Sequelize ORM
- **Authentication & Authorization**
  - JSON Web Tokens (JWT)
  - Role-based access control
- **Deployment / DevOps**
  - Docker
  - GitHub Actions
  - Vercel / Netlify for frontend
  - AWS / Azure / DigitalOcean for backend/database

## Application Features

- Dashboard overview with key metrics
- Asset portfolio tracking
- Fractional ownership management
- Transaction history and status updates
- User account management and role controls
- Data visualization with charts and tables

## Data Schema

### Users

- `id` (UUID)
- `name` (string)
- `email` (string)
- `passwordHash` (string)
- `role` (enum: `admin`, `manager`, `user`)
- `createdAt` (datetime)
- `updatedAt` (datetime)

### Assets

- `id` (UUID)
- `name` (string)
- `type` (string)
- `description` (string)
- `currentValue` (decimal)
- `location` (string)
- `createdAt` (datetime)
- `updatedAt` (datetime)

### OwnershipShares

- `id` (UUID)
- `assetId` (UUID)
- `ownerId` (UUID)
- `sharePercentage` (decimal)
- `sharesOwned` (integer)
- `valueAtPurchase` (decimal)
- `acquiredAt` (datetime)

### Transactions

- `id` (UUID)
- `userId` (UUID)
- `assetId` (UUID)
- `transactionType` (enum: `buy`, `sell`, `transfer`, `dividend`)
- `amount` (decimal)
- `status` (enum: `pending`, `completed`, `failed`)
- `createdAt` (datetime)
- `updatedAt` (datetime)

### PortfolioSummaries

- `id` (UUID)
- `userId` (UUID)
- `totalValue` (decimal)
- `totalShares` (decimal)
- `performanceChange` (decimal)
- `lastUpdated` (datetime)

## Folder Structure

- `src/`
  - `components/`
  - `pages/`
  - `services/`
  - `hooks/`
  - `styles/`
- `server/`
  - `controllers/`
  - `routes/`
  - `models/`
  - `middleware/`

## Notes

This README provides a high-level summary of the website, including the main technologies and data schema used for the dashboard application. Adjust the schema and technology list to match the exact implementation details of the Fractio project.
