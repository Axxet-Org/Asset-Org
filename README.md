# BlueCollar

> Enterprise-grade asset and inventory management — powered by [Stellar](https://stellar.org) smart contracts.

BlueCollar is an open-source monorepo for tracking, registering, and managing physical and digital assets across departments, locations, and regions. It combines a NestJS REST API, a Next.js web interface, and Soroban smart contracts on the Stellar blockchain to deliver a transparent, auditable asset lifecycle system.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Contracts Setup](#contracts-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Stellar Integration](#stellar-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Organizations managing physical equipment, software licenses, or digital assets across multiple teams often rely on fragmented spreadsheets or rigid legacy tools. BlueCollar solves this by providing:

- A **centralized registry** for all asset types
- **Role-based access control** (Admin, Manager, Staff)
- **Lifecycle tracking** — from registration through retirement
- **On-chain asset records** via Stellar Soroban contracts for immutable audit trails
- **Multi-department and multi-location** support

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      BlueCollar                         │
│                                                         │
│  ┌──────────────┐   REST API   ┌──────────────────────┐ │
│  │   Next.js    │ ──────────── │     NestJS API       │ │
│  │  (Frontend)  │              │     (Backend)        │ │
│  └──────────────┘              └──────────┬───────────┘ │
│                                           │             │
│                                    ┌──────▼──────┐      │
│                                    │  PostgreSQL │      │
│                                    └─────────────┘      │
│                                           │             │
│                                    ┌──────▼──────┐      │
│                                    │   Stellar   │      │
│                                    │  (Soroban)  │      │
│                                    └─────────────┘      │
└─────────────────────────────────────────────────────────┘
```

The backend is the single source of truth for business logic. Critical asset events (registration, transfer, retirement) are also written to a Soroban smart contract on Stellar for an immutable, verifiable audit trail.

---

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **TanStack Query** — server state management
- **Zustand** — client state
- **React Hook Form + Zod** — form validation

### Backend
- **NestJS** — modular Node.js framework
- **PostgreSQL** — relational database
- **TypeORM** — ORM with migrations
- **Passport + JWT** — authentication

### Contracts
- **Stellar Soroban** — smart contract platform
- **Rust** — contract language
- `soroban-sdk` — Stellar contract SDK

### DevOps
- **GitHub Actions** — CI/CD
- **Docker** — containerized deployment

---

## Monorepo Structure

```
bluecollar/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── assets/           # Asset CRUD module
│   │   ├── auth/             # JWT authentication
│   │   ├── users/            # User management
│   │   ├── categories/       # Asset categories
│   │   ├── departments/      # Department management
│   │   ├── reports/          # Reporting module
│   │   ├── stellar/          # Stellar contract integration
│   │   └── app.module.ts
│   ├── .env.example
│   └── package.json
│
├── frontend/                 # Next.js web app
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── login/            # Auth pages
│   │   └── dashboard/        # Asset dashboard
│   ├── components/           # Shared UI components
│   ├── lib/
│   │   ├── api.ts            # Axios client
│   │   └── store.ts          # Zustand store
│   └── package.json
│
├── contracts/                # Stellar Soroban contracts
│   ├── bluecollar/           # Core asset contract
│   │   └── src/lib.rs
│   └── Cargo.toml
│
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI
│
├── package.json              # Monorepo root
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** v14+
- **Rust** (stable) + `wasm32-unknown-unknown` target
- **Stellar CLI** (`stellar` or `soroban` CLI)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migration:run
npm run start:dev
```

Backend runs at `http://localhost:3001`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

### Contracts Setup

```bash
# Install Rust target
rustup target add wasm32-unknown-unknown

# Build the contract
cd contracts
cargo build --target wasm32-unknown-unknown --release

# Deploy to Stellar testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/bluecollar.wasm \
  --network testnet \
  --source <your-account>
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable          | Description                        | Default       |
|-------------------|------------------------------------|---------------|
| `DATABASE_HOST`   | PostgreSQL host                    | `localhost`   |
| `DATABASE_PORT`   | PostgreSQL port                    | `5432`        |
| `DATABASE_USER`   | PostgreSQL user                    | `postgres`    |
| `DATABASE_PASSWORD` | PostgreSQL password              | `postgres`    |
| `DATABASE_NAME`   | Database name                      | `bluecollar`  |
| `JWT_SECRET`      | Secret for signing JWT tokens      | —             |
| `PORT`            | API server port                    | `3001`        |

### Frontend (`frontend/.env.local`)

| Variable                | Description              | Default                        |
|-------------------------|--------------------------|--------------------------------|
| `NEXT_PUBLIC_API_URL`   | Backend API base URL     | `http://localhost:3001/api`    |

---

## API Reference

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint          | Description         |
|--------|-------------------|---------------------|
| POST   | `/auth/register`  | Register a new user |
| POST   | `/auth/login`     | Login, returns JWT  |

### Assets

| Method | Endpoint         | Description              | Auth |
|--------|------------------|--------------------------|------|
| GET    | `/assets`        | List all assets          | ✅   |
| GET    | `/assets/:id`    | Get asset by ID          | ✅   |
| POST   | `/assets`        | Register a new asset     | ✅   |
| PATCH  | `/assets/:id`    | Update asset             | ✅   |
| DELETE | `/assets/:id`    | Delete asset             | ✅   |

---

## Stellar Integration

BlueCollar uses [Stellar Soroban](https://soroban.stellar.org) smart contracts to record critical asset events on-chain. This provides:

- **Immutable audit trail** — every registration, transfer, and retirement is recorded on the Stellar blockchain
- **Decentralized verification** — anyone can verify asset history without trusting a central server
- **Multi-sig support** — high-value asset transfers can require multiple approvals

### Contract Functions

| Function           | Description                                  |
|--------------------|----------------------------------------------|
| `register_asset`   | Register a new asset with an owner address   |
| `transfer_asset`   | Transfer ownership to a new address          |
| `retire_asset`     | Mark an asset as retired                     |
| `get_asset`        | Read asset state from the ledger             |

The backend's `stellar` module handles contract invocation via the Stellar SDK, bridging the off-chain PostgreSQL records with on-chain state.

---

## Deployment

### Docker

```bash
# Build and start all services
docker compose up --build
```

A `docker-compose.yml` is planned for the full release. It will include:
- `bluecollar-api` — NestJS backend
- `bluecollar-web` — Next.js frontend
- `postgres` — database

### CI/CD

GitHub Actions runs on every push to `main` and `develop`:
- Lints and tests the backend (with a live PostgreSQL service)
- Lints and builds the frontend
- Compiles and tests Stellar contracts

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes with clear messages
4. Open a pull request with a description of what changed and why

Please follow the existing code style. Run `npm run lint` before submitting.

---

## License

MIT — see [LICENSE](./LICENSE) for details.
