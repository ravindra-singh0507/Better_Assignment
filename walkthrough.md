# TinyWarehouse Walkthrough

## Structure
- `backend/`: Flask app with SQLAlchemy models and Pydantic validation.
- `frontend/`: React app with TypeScript and Tailwind CSS.
- `ai_docs/`: AI constraints and coding standards.

## Verification
### Backend
- Ran `pytest` to verify API endpoints and constraints.
- Confirmed negative stock checks work correctly.
- Confirmed transactional safety for stock movements.

### Frontend
- Built successfully using Vite.
- Verified TypeScript types match backend schemas.
- Components include: StockList, CreateProduct, CreateLocation, StockAction.

## Dependencies
- **Backend**: Flask, SQLAlchemy, Pydantic, Psycopg2.
- **Frontend**: React, TypeScript, Tailwind CSS, Axios, Lucide React.
