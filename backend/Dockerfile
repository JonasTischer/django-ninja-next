# First, build the application in the `/app` directory.
# See `Dockerfile` for details.
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy

# Disable Python downloads, because we want to use the system interpreter
# across both images. If using a managed Python version, it needs to be
# copied from the build image into the final image; see `standalone.Dockerfile`
# for an example.
ENV UV_PYTHON_DOWNLOADS=0

WORKDIR /app
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project --no-dev
ADD . /app
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

# Then, use a final image without uv
FROM python:3.12-slim-bookworm
# It is important to use the image that matches the builder, as the path to the
# Python executable must be the same, e.g., using `python:3.11-slim-bookworm`
# will fail.

# Create app user
RUN groupadd -r app && useradd -r -g app app

WORKDIR /app

# Copy the application from the builder
COPY --from=builder --chown=app:app /app /app

# Create directories for static and media files
RUN mkdir -p /app/static /app/staticfiles /app/media && \
    chown -R app:app /app/static /app/staticfiles /app/media

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

# Switch to app user
USER app

ENTRYPOINT ["python", "/app/docker_entrypoint.py"]