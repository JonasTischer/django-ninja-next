<a href="https://github.com/JonasTischer/django-ninja-next-template">
  <img alt="Django Ninja Next.js Template" src="demo.gif">
  <h1 align="center">Django Ninja Next.js Template</h1>
</a>

<p align="center">
  Jumpstart your full-stack development with Django and Next.js!
</p>

<p align="center">
  <a href="https://twitter.com/JonasTischer">
    <img src="https://img.shields.io/twitter/follow/JonasTischer?style=flat&label=JonasTischer&logo=twitter&color=0bf&logoColor=fff" alt="Twitter follower count" />
  </a>
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="#tech-stack--features"><strong>Tech Stack + Features</strong></a> ·
  <a href="#author"><strong>Author</strong></a>
</p>
<br/>

## Introduction

This template combines Django 5 wfor the backend and Next.js 14 for the frontend. It includes JWT authentication on the backend and Shadcn UI components for the frontend. This setup helps you start building full-stack web applications more quickly.

## Installation

## Prerequisites
- Python 3.12 with [uv](https://docs.astral.sh/uv/getting-started/installation/) installed
- Node.js (>=20) and [bun](https://bun.com/docs/installation)
- [just](https://just.systems/man/en/) command runner
- Docker and Docker Compose (for local Postgres or running commands in containers)
- [pre-commit](https://pre-commit.com/#install) for code quality checks

Clone & create this repo locally with the following command:

```bash
git clone https://github.com/JonasTischer/django-ninja-next-template.git
cd django-ninja-next-template
```

## First-Time Setup
1. Copy environment templates and adjust secrets as needed:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.local.example frontend/.env.local
   ```
2. Install backend and frontend dependencies:
   ```bash
   just setup
   ```

## Installing and Activating Pre-Commit Hooks¶
To activate pre-commit hooks, run the following commands for each configuration file:

For the local configuration file:

`pre-commit install -c .pre-commit-config.yaml`

Running Pre-Commit Checks¶
To manually run the pre-commit checks on all files, use:

`pre-commit run --all-files -c .pre-commit-config.yaml`

or

`pre-commit run --all-files -c .pre-commit-config.docker.yaml``

Updating Pre-Commit Hooks

To update the hooks to their latest versions, run:

`pre-commit autoupdate`


## Daily Development Flow
1. Launch the stack:
   - `just start-backend` – FastAPI with hot reload (uv + uvicorn)
   - `just start-frontend` – Next.js dev server (`pnpm` script)
   - `just dev` – Convenience command that kicks off both (stop with `Ctrl+C`)
2. Regenerate the typed API client whenever backend schemas or routes change:
   ```bash
   just generate-client
   ```
3. Keep the database schema up to date:
   ```bash
   just migrate                # Apply Alembic migrations locally
   just create-migration MESSAGE="add scenarios table"   # Generate a new migration
   ```

## Common Commands
**Quality checks**
- `just typecheck` – Next.js TypeScript project type checking
- `just lint` – Ruff (Python) + ESLint (frontend) with autofix
- `just format` – Format validation (no writes)

**Testing**
- `just test` – Backend pytest followed by frontend unit tests

Run `just --list` or `just help` for a full catalog of tasks and descriptions.

## Tech Stack + Features

### Backend (Django 5)

- [Django](https://www.djangoproject.com/) – High-level Python web framework
- [Django Ninja](https://django-ninja.rest-framework.com/) – Fast, async-ready REST framework with automatic OpenAPI schema generation

### Frontend (Next.js 15)

- [Next.js 15](https://nextjs.org/) – React framework for building performant apps with the best developer experience
- [TypeScript](https://www.typescriptlang.org/) – Typed superset of JavaScript
- [Tailwind CSS v4](https://tailwindcss.com/) – Utility-first CSS framework for rapid UI development
- [Shadcn UI](https://ui.shadcn.com/) – Re-usable components built using Radix UI and Tailwind CSS
- [Tanstack Query](https://tanstack.com/query/latest) – Powerful asynchronous state management for TS/JS
- [React Hook Form](https://react-hook-form.com/) – Performant, flexible and extensible forms with easy-to-use validation
- [Zod](https://github.com/colinhacks/zod) – TypeScript-first schema validation with static type inference

### Development and Deployment

- [Docker](https://www.docker.com/) – Containerization platform for easy deployment and scaling
- [PostgreSQL](https://www.postgresql.org/) – Powerful, open-source object-relational database system

## Roadmap

- [ ] Complete deployment configuration
  - [ ] Set up production environment
  - [ ] Configure domain and SSL
  - [ ] Implement logging and monitoring
- [ ] Fully containerize with Docker and PostgreSQL
  - [ ] Create production-ready Dockerfiles
  - [ ] Set up Docker Compose for local development
  - [ ] Configure PostgreSQL for scalability
- [ ] Add comprehensive testing suite
  - [ ] Unit tests for backend APIs
  - [ ] Integration tests for frontend components
  - [ ] End-to-end testing with Cypress
  - [ ] Performance testing
- [ ] Implement CI/CD pipeline
  - [ ] Automated testing on pull requests
  - [ ] Continuous deployment to staging
  - [ ] Production deployment automation
  - [ ] Security scanning and checks


## Author

Created by Jonas Tischer in 2025.

## License

[MIT License](https://opensource.org/licenses/MIT)
