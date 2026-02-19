# TinyWarehouse

A simple, robust inventory management system built with Flask, React, and PostgreSQL.

## Features
- **Strict Typing**: TypeScript frontend + Pydantic backend ensure data integrity.
- **Transactional Safety**: Stock movements are atomic.
- **Constraints**: Database constraints prevent negative stock. 
- **Modern UI**: Built with React, Tailwind CSS, and Lucide icons.

## Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL

### Backend
```bash
cd backend
python -m venv venv
# Activate venv (Windows: .\venv\Scripts\activate, Linux/Mac: source venv/bin/activate)
pip install -r requirements.txt
# Set DATABASE_URL in .env (copy from .env.example)
python run.py
```
Currently configured to use `postgresql://postgres:password@localhost/tinywarehouse` by default.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Access the app at `http://localhost:5173`.

## Key Decisions
- **PostgreSQL**: Chosen for robustness over SQLite.
- **Pydantic**: Used for strict input validation.
- **Vite**: Fast build tool for React.
