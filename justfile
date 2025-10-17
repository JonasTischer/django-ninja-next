# Variables
BACKEND_DIR := "backend"
FRONTEND_DIR := "frontend"
FRONTEND_PACKAGE_MANAGER := "bun"

help:
    @echo "Available commands:"
    @just --list

setup:
    cd {{BACKEND_DIR}} && uv sync --all-extras --dev
    cd {{FRONTEND_DIR}} && {{FRONTEND_PACKAGE_MANAGER}} install
    pre-commit install -c .pre-commit-config.yaml

frontend-dev:
    cd {{FRONTEND_DIR}} && {{FRONTEND_PACKAGE_MANAGER}} run dev

backend-dev:
    cd {{BACKEND_DIR}} && uv run python manage.py runserver

dev:
    cd {{FRONTEND_DIR}} && {{FRONTEND_PACKAGE_MANAGER}} run dev & cd {{BACKEND_DIR}} && uv run python manage.py runserver

lint:
    cd {{BACKEND_DIR}} && uv run ruff check . --fix
    cd {{FRONTEND_DIR}} && {{FRONTEND_PACKAGE_MANAGER}} run lint:fix

format:
    cd {{BACKEND_DIR}} && uv run ruff format --check .
    cd {{FRONTEND_DIR}} && {{FRONTEND_PACKAGE_MANAGER}} run format

typecheck:
    cd {{FRONTEND_DIR}} && {{FRONTEND_PACKAGE_MANAGER}} run typecheck

manage COMMAND:
    cd {{BACKEND_DIR}} && uv run python manage.py {{COMMAND}}

test ARGS="":
    cd {{BACKEND_DIR}} && uv run pytest {{ARGS}}


generate-client:
    chmod +x scripts/generate-client.sh
    ./scripts/generate-client.sh