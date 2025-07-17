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

lint:
    cd backend && uv run ruff check . --fix
    cd frontend && bun run biome lint ./src --fix

typecheck:
    cd frontend && bun run typecheck

format:
    cd backend && uv run ruff format --check .
    cd frontend && bun run biome format ./src

generate-client:
    chmod +x scripts/generate-client.sh
    ./scripts/generate-client.sh
