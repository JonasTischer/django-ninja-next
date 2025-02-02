from ninja_extra import NinjaExtraAPI
import pytest
from django.contrib.auth import get_user_model
from ninja_extra.testing import TestClient
from django.conf import settings

from users.api import AuthController
from .factories import UserAccountFactory
from django.conf import settings


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
        assert "refresh" in response.json()
        assert "user" in response.json()
        # Check cookies are set
        # Check cookies
        assert settings.AUTH_COOKIE in response.cookies
        assert settings.REFRESH_COOKIE in response.cookies
        assert response.cookies[settings.AUTH_COOKIE]['httponly']
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
        # First login to get tokens
        user = UserAccountFactory()
        login_response = api_client.post(
            "/login",
            json={"email": user.email, "password": "password"},
        )

     # Set cookies for logout
        api_client.cookies = {
            'access': login_response.cookies['access'].value,
            'refresh': login_response.cookies['refresh'].value
        }

        response = api_client.post("/logout", COOKIES=api_client.cookies)
        assert response.status_code == 204

        # Check that cookies are "deleted" (empty value and expired)
        for cookie_name in ['access', 'refresh']:
            cookie = response.cookies.get(cookie_name)
            assert cookie is not None  # Cookie exists
            assert cookie.value == ''  # Empty value
            assert cookie['max-age'] == 0  # Expired
            # Or check expires date
            assert 'expires' in cookie and cookie['expires'] == 'Thu, 01 Jan 1970 00:00:00 GMT'

    def test_refresh_token(self, api_client):
        # First login to get a refresh token
        user = UserAccountFactory()
        login_response = api_client.post(
            "/login",
            json={"email": user.email, "password": "password"}
        )

        # Set refresh token cookie
        api_client.cookies = {
            settings.REFRESH_COOKIE: login_response.cookies[settings.REFRESH_COOKIE].value
        }

        response = api_client.post("/refresh", COOKIES=api_client.cookies)
        assert response.status_code == 200
        assert settings.AUTH_COOKIE in response.cookies
        assert "Token refreshed successfully" in response.json()["detail"]


    def test_refresh_token_missing(self, api_client):
        response = api_client.post("/refresh")
        assert response.status_code == 401
        assert response.json()["detail"] == "Refresh token not found"

    def test_get_user_authenticated(self, api_client):
        # Create user
        user = UserAccountFactory()

        # Login
        login_response = api_client.post(
            "/login",
            json={"email": user.email, "password": "password"}
        )
        assert login_response.status_code == 200

        api_client.cookies = {
            'access': login_response.cookies['access'].value,
            'refresh': login_response.cookies['refresh'].value
        }

        # Make authenticated request
        response = api_client.get("/me", COOKIES=api_client.cookies, user=user)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == user.email

    def test_get_user_unauthenticated(self, api_client):
        response = api_client.get("/me")
        assert response.status_code == 401