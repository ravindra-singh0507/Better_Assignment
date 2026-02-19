from app import create_app, db
import os

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        # Create tables if they don't exist (for dev simplicity)
        # In prod, use migrations (Alembic)
        try:
            db.create_all()
            print("Database tables created (if not existed).")
        except Exception as e:
            print(f"Error creating database tables: {e}")
            print("Ensure PostgreSQL is running and DATABASE_URL is correct.")
            
    app.run(debug=True, port=int(os.getenv('PORT', 5000)))
