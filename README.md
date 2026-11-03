# CareerScope

**Explore careers through real occupational employment and wage data.**

CareerScope is a full-stack career intelligence application built with React and FastAPI. It transforms public U.S. Bureau of Labor Statistics (BLS) data into an accessible interface for exploring occupations, understanding compensation, and making more informed career decisions.

The project also demonstrates full-stack application development, data engineering, API design, data visualization, automated testing, and professional GitFlow practices.

## Features

- **Career dashboard:** Overview of occupational data and top-paying occupations.
- **Occupation explorer:** Search and browse occupations with paginated results.
- **Occupation details:** View occupation-specific wage and employment estimates.
- **Wage analytics:** Visualize available salary statistics and wage distributions.
- **Responsive interface:** Support for desktop and mobile devices.
- **Appearance preferences:** Light, Dark, and System themes with persistent settings.
- **REST API:** FastAPI endpoints backed by a local SQLite database.

CareerScope is under active development. Additional navigation, analytics, and UI improvements are planned.

## Technology Stack

| Layer            | Technologies                                |
| ---------------- | ------------------------------------------- |
| Frontend         | React 19, Vite 8, JavaScript                |
| Navigation       | React Router 7                              |
| Styling          | CSS custom properties, custom design system |
| Visualization    | Recharts 3                                  |
| Icons            | Lucide React                                |
| HTTP client      | Axios                                       |
| Backend          | Python, FastAPI                             |
| Database         | SQLite, SQLAlchemy                          |
| Data processing  | pandas, openpyxl                            |
| Frontend testing | Vitest, React Testing Library               |
| Backend testing  | pytest                                      |
| Code quality     | ESLint, Ruff                                |
| Version control  | Git, GitHub, GitFlow                        |

## Project Structure

```text
CareerScope/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── etl.py
│   ├── scripts/
│   │   ├── check_bls.py
│   │   └── import_bls.py
│   ├── tests/
│   ├── data/
│   │   └── raw/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── tests/
│   ├── .env.example
│   ├── DESIGN_SYSTEM.md
│   └── package.json
└── README.md
```

This diagram highlights the primary application files and directories, not every file in the repository.

## Getting Started

### Prerequisites

Install the following:

- Python 3.11 or later with support for the project's dependencies
- Node.js and npm compatible with the installed Vite version
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Techdudetony/CareerScope.git
cd CareerScope
```

### 2. Set up the backend

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv .venv
```

Activate it.

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Windows Git Bash:

```bash
source .venv/Scripts/activate
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

### 3. Prepare the BLS dataset

CareerScope currently uses the **May 2025 BLS Occupational Employment and Wage Statistics (OEWS)** national dataset.

Download the national Excel workbook from:

https://www.bls.gov/oes/tables.htm

Save the workbook at:

```text
backend/data/raw/national_M2025_dl.xlsx
```

The current import script expects this exact filename and location.

Validate the workbook:

```bash
python -m scripts.check_bls
```

Import the dataset into SQLite:

```bash
python -m scripts.import_bls
```

The import script creates the necessary database tables and loads the occupation and wage records.

### 4. Start the backend

From `backend`, run:

```bash
python -m uvicorn app.main:app --reload
```

The API will be available at:

http://127.0.0.1:8000

Interactive API documentation:

http://127.0.0.1:8000/docs

Health check:

http://127.0.0.1:8000/health

### 5. Set up the frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Copy the example environment file to `.env`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Git Bash:

```bash
cp .env.example .env
```

The default API configuration is:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Open:

http://localhost:5173

Keep both backend and frontend development servers running.

## API Endpoints

| Method | Endpoint                         | Description                     |
| ------ | -------------------------------- | ------------------------------- |
| GET    | `/health`                        | API health status               |
| GET    | `/api/v1/occupations`            | List and search occupations     |
| GET    | `/api/v1/occupations/{code}`     | Retrieve occupation details     |
| GET    | `/api/v1/occupations/top-paying` | Retrieve top-paying occupations |

### Example requests

Search for occupations:

```http
GET /api/v1/occupations?search=software&limit=25&offset=0
```

Retrieve an occupation:

```http
GET /api/v1/occupations/15-1252
```

Retrieve top-paying occupations:

```http
GET /api/v1/occupations/top-paying?limit=10&year=2025
```

## Data Source and Limitations

CareerScope uses public data from the U.S. Bureau of Labor Statistics.

**Current dataset:** May 2025 Occupational Employment and Wage Statistics.

The current ETL process focuses on U.S. national, cross-industry, detailed occupations.

Available data includes occupational titles, employment estimates, annual mean wages, annual median wages, and selected wage percentiles.

Important limitations:

- Employment estimates are not job-opening counts.
- Wage estimates do not guarantee individual salaries.
- Missing or suppressed values may be unavailable.
- The current application focuses on national estimates rather than location-specific wage comparisons.
- Data reflects the published reference period and is not a live labor-market feed.

Source: https://www.bls.gov/oes/

## Testing and Code Quality

### Frontend

From `frontend`:

```bash
npm run test
npm run lint
npm run build
npm audit --omit=dev
```

### Backend

From `backend`, with the Python environment activated:

```bash
python -m pytest tests/ -v
python -m ruff check .
```

All relevant checks should pass before opening a pull request.

## Design System

CareerScope follows the **Intelligence Hybrid** design direction.

The design combines a distinctive dark visual identity with readable analytics surfaces, semantic colors, reusable UI components, responsive layouts, and accessible interactions.

See [Frontend Design System](frontend/DESIGN_SYSTEM.md) for implementation conventions.

## GitFlow Workflow

CareerScope follows a feature-branch workflow.

| Branch      | Purpose                             |
| ----------- | ----------------------------------- |
| `main`      | Stable releases                     |
| `develop`   | Integration and ongoing development |
| `feature/*` | New features                        |
| `fix/*`     | Bug fixes during development        |
| `release/*` | Release preparation                 |
| `hotfix/*`  | Urgent production corrections       |

### Standard feature workflow

```bash
git switch develop
git pull --ff-only origin develop
git switch -c feature/example-feature
```

After implementation and testing:

```bash
git add .
git commit -m "feat: describe the change"
git push -u origin feature/example-feature
```

Open a pull request targeting `develop`.

Pull requests should include a summary, type of change, implementation details, testing results, screenshots where applicable, and the GitFlow checklist.

## Development Roadmap

- [x] FastAPI backend and SQLite data storage
- [x] BLS data ingestion and validation
- [x] React frontend and occupation browsing
- [x] Intelligence Hybrid design-system foundation
- [ ] App shell and responsive navigation
- [ ] Redesigned landing page
- [ ] Enhanced occupation explorer
- [ ] Improved wage analytics
- [ ] Motion, accessibility, and performance refinement

## Project Status

**Active development**

CareerScope is a portfolio project and is not yet presented as a production-ready career guidance service.

## Author

Developed by [Techdudetony](https://github.com/Techdudetony).

## Data Attribution

Occupational employment and wage estimates are sourced from the U.S. Bureau of Labor Statistics, Occupational Employment and Wage Statistics program.

CareerScope is an independent project and is not affiliated with or endorsed by the U.S. Bureau of Labor Statistics.
