# CareerScope Frontend

CareerScope is a career and wage analytics application built with
React, Vite, FastAPI, and official BLS OEWS data.

## Technology

- React
- Vite
- React Router
- Axios
- Recharts
- Lucide React
- Vitest
- React Testing Library

## Prerequisites

- Node.js compatible with Vite 8
- npm
- Python 3.11
- CareerScope FastAPI backend
- Imported BLS OEWS dataset

## Installation

From the frontend directory:

```bash
npm ci
cp .env.example .env.local
```

## Environment configuration

The frontend uses:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000
```

The `.env.example` file is committed to Git.

The `.env.local` file is machine-specific and ignored by Git.

Never store secrets in variables prefixed with `VITE_`.

## Running the backend

From the backend directory with the Python virtual environment active:

```bash
python -m uvicorn app.main:app --reload
```

Verify:

http://127.0.0.1:8000/health

The occupation endpoints also require an initialized database
containing the imported BLS data.

## Running the frontend

From the frontend directory:

```bash
npm run dev
```

Open the local address printed by Vite.

## Application pages

- `/` : Dashboard and top-paying occupations
- `/occupations` : Searchable occupation directory
- `/occupations/:code` : Occupation details and wage estimates

## Testing

```bash
npm run test
npm run lint
npm run build
npm audit --omit=dev
```

## Troubleshooting

If the frontend cannot load occupation data:

1. Verify the FastAPI server is running.
2. Verify the `/health` endpoint returns status `ok`.
3. Verify `/api/v1/occupations` returns records.
4. Check that the SQLite database has been initialized.
5. Verify `VITE_API_BASE_URL` in `.env.local`.
6. Restart Vite after changing environment variables.

## Data source

U.S. Bureau of Labor Statistics
Occupational Employment and Wage Statistics (OEWS)
May 2025 national estimates.
