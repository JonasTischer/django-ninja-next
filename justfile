frontend-dev:
    cd frontend && bun run dev

backend-dev:
    cd backend && uv run python manage.py runserver
dev:
    cd frontend && bun run dev & cd backend && uv run python manage.py runserver

manage COMMAND:
    cd backend && uv run python manage.py {{COMMAND}}

test ARGS="":
    cd backend && uv run pytest {{ARGS}}
