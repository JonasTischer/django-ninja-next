#!/usr/bin/env bash

set -e
set -x

# Generate OpenAPI spec directly using Python with Django settings
cd backend
DJANGO_SETTINGS_MODULE=core.settings uv run python -c "
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from core.api import api
import json

schema = api.get_openapi_schema()
print(json.dumps(schema))
" > ../openapi.json

# Move to frontend and generate client
cd ..
mv openapi.json frontend/
cd frontend
bun run openapi-ts
echo "Formatting generated client in $(pwd)"
bunx @biomejs/biome format --write ./src/generated