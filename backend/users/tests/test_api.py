import pytest
from django.contrib.auth import get_user_model
from ninja_extra.testing import TestClient
from django.conf import settings

from users.api import AuthController
from .factories import UserAccountFactory


User = get_user_model()

@pytest.fixture
def api_client():
    return TestClient(AuthController)


@pytest.mark.django_db
class TestAuthEndpoints:
    def test_login_successful(self, api_client):
        # Create a user
        user = UserAccountFactory()
        # Attempt login
        response = api_client.post(
            "/login",
            json={"email": user.email, "password": "password"}
        )

        assert response.status_code == 200
        assert "access" in response.json()
        # Check cookies are set
        # Check cookies
        assert settings.REFRESH_COOKIE in response.cookies
        assert response.cookies[settings.REFRESH_COOKIE]['httponly']

    def test_login_invalid_credentials(self, api_client):
        response = api_client.post(
            "/login",
            json={"email": "wrong@email.com", "password": "wrongpass"}
        )
        assert response.status_code == 401

    def test_register_successful(self, api_client):
        user_data = {
            "email": "test@example.com",
            "password": "StrongPass123!",
            "re_password": "StrongPass123!",
            "first_name": "Test",
            "last_name": "User"
        }

        response = api_client.post("/register", json=user_data)

        assert response.status_code == 200
        assert User.objects.filter(email="test@example.com").exists()
        user = User.objects.get(email="test@example.com")
        assert user.first_name == "Test"
        assert user.last_name == "User"

    def test_register_duplicate_email(self, api_client):
        # Create existing user
        UserAccountFactory(email="exists@example.com")

        user_data = {
            "email": "exists@example.com",
            "password": "StrongPass123!",
            "re_password": "StrongPass123!",
            "first_name": "Test",
            "last_name": "User"
        }

        response = api_client.post("/register", json=user_data)
        assert response.status_code == 400
        assert response.json() == "Email already registered"

    def test_register_password_mismatch(self, api_client):
        user_data = {
            "email": "test@example.com",
            "password": "StrongPass123!",
            "re_password": "DifferentPass123!",
            "first_name": "Test",
            "last_name": "User"
        }

        response = api_client.post("/register", json=user_data)
        assert response.status_code == 422
        error = response.json()
        assert error["detail"] == "Passwords do not match"

    def test_logout(self, api_client):
        response = api_client.post("/logout")
        assert response.status_code == 204

    def test_me_requires_authentication(self, api_client):
        response = api_client.get("/me")
        assert response.status_code == 401

    def test_login_sets_refresh_token_cookie(self, api_client):
        user = UserAccountFactory()
        response = api_client.post(
            "/login",
            json={"email": user.email, "password": "password"},
        )

        assert response.status_code == 200
        # Check that refresh cookie is set
        assert settings.REFRESH_COOKIE in response.cookies

    def test_refresh_token_endpoint(self, api_client, settings):
        # Configure cookie settings for tests (override production settings)

        # Create user and login to get tokens
        user = UserAccountFactory()
        login_response = api_client.post(
            "/login", json={"email": user.email, "password": "password"}
        )
        assert login_response.status_code == 200

        # Check that refresh cookie was set in login
        assert settings.REFRESH_COOKIE in login_response.cookies
        refresh_cookie = login_response.cookies[settings.REFRESH_COOKIE]

        # Test refresh endpoint
        response = api_client.post(
            "/refresh",
            COOKIES={settings.REFRESH_COOKIE: refresh_cookie.value}
        )

        assert response.status_code == 200
        data = response.json()
        assert "access" in data
        assert "detail" in data
        # Should also set a new refresh token cookie
        assert settings.REFRESH_COOKIE in response.cookies

    def test_refresh_token_without_cookie(self, api_client):
        response = api_client.post("/refresh")
        assert response.status_code == 401

    def test_get_me_with_valid_token(self, api_client):
        user = UserAccountFactory()
        login_response = api_client.post(
            "/login", json={"email": user.email, "password": "password"}
        )
        access_token = login_response.json()["access"]

        response = api_client.get(
            "/me", headers={"Authorization": f"Bearer {access_token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["email"] == user.email
        assert data["first_name"] == user.first_name
        assert data["last_name"] == user.last_name