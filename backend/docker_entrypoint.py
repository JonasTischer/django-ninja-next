import os
import subprocess
import time
import sys
import click


@click.group()
def docker_run():
    pass


@docker_run.command()
def migrate():
    """Run Django migrations against the database."""
    _migration()


@docker_run.command(
    context_settings=dict(
        ignore_unknown_options=True,
    )
)
@click.argument("args", nargs=-1, type=click.UNPROCESSED)
def run_api(args):
    """Run the application using uvicorn."""
    _migration()
    _create_default_admin()
    _collect_static()

    app_port = os.getenv("PORT", "8000")

    click.echo(f"Running application on port {app_port}.")
    click.echo(f"Additional arguments: {args}")
    subprocess.run(
        [
            "uvicorn",
            "core.asgi:application",
            "--host",
            "0.0.0.0",
            "--port",
            app_port,
            "--timeout-keep-alive",
            "120",
        ]
        + list(args)
    )


def _create_default_admin():
    click.echo("Creating default admin user (if necessary).")
    start_time = time.time()
    # Run the custom management command
    # No need to check return code here if the command handles errors itself
    subprocess.run(["python", "manage.py", "create_default_admin"])
    click.echo(f"Admin user check/creation completed in {time.time() - start_time:.2f} seconds.")


@docker_run.command(
    context_settings=dict(
        ignore_unknown_options=True,
    )
)
def dev_server():
    """Run development server with hot reload"""
    app_port = os.getenv("PORT", "8000")
    subprocess.run(["uvicorn", "core.asgi:application", "--host", "0.0.0.0", "--port", app_port, "--reload"])


@docker_run.command(
    context_settings=dict(
        ignore_unknown_options=True,
    )
)
@click.argument("args", nargs=-1, type=click.UNPROCESSED)
def worker(args):
    """Start a celery worker process."""
    subprocess.run(
        ["celery", "-A", "core", "worker", "--loglevel=info"] + list(args)
    )


@docker_run.command(
    context_settings=dict(
        ignore_unknown_options=True,
    )
)
def test():
    """Run tests."""
    result = subprocess.run(["uv", "run", "pytest", "-s"])
    exit(result.returncode)


@docker_run.command(
    context_settings=dict(
        ignore_unknown_options=True,
    )
)
def test_unit():
    """Run unit tests."""
    result = subprocess.run(["uv", "run", "pytest"])
    exit(result.returncode)


@docker_run.command(
    context_settings=dict(
        ignore_unknown_options=True,
    )
)
def test_integration():
    """Run integration tests."""
    result = subprocess.run(["uv", "run", "pytest", "-m", "integration_test"])
    exit(result.returncode)


def _migration():
    click.echo("Running migrations.")
    start_time = time.time()
    subprocess.run(["python", "manage.py", "migrate", "--noinput"])
    click.echo(f"Migrations completed in {time.time() - start_time} seconds.")


def _collect_static():
    # Only run collectstatic if AWS settings are likely configured
    if os.getenv("USE_AWS", "False") == "True" and os.getenv("DEVELOPMENT_MODE", "True") == "False":
        click.echo("Collecting static files.")
        start_time = time.time()
        # Run collectstatic non-interactively
        result = subprocess.run(["python", "manage.py", "collectstatic", "--noinput"])
        if result.returncode != 0:
            click.echo(click.style("Collectstatic failed!", fg="red"))
            # Decide if you want to exit if collectstatic fails
            # sys.exit(result.returncode)
        else:
            click.echo(f"Static files collected in {time.time() - start_time:.2f} seconds.")
    else:
        click.echo("Skipping collectstatic (not in AWS production mode).")


if __name__ == "__main__":
    # If no arguments are provided, run the dev server by default
    if len(sys.argv) == 1:
        sys.argv.append("dev-server")
    docker_run()