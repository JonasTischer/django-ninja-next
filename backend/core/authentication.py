import logging
from ninja_jwt.authentication import JWTBaseAuthentication
from ninja.security import HttpBearer
from core import settings
from typing import Optional, Any
from django.http import HttpRequest
from django.contrib.auth.models import AbstractUser
logger = logging.getLogger(__name__)

class CookieJWTAuth(JWTBaseAuthentication, HttpBearer):
    def __call__(self, request: HttpRequest) -> Optional[AbstractUser]:
        """Override __call__ to check cookies instead of Authorization header"""
        token = request.COOKIES.get(settings.AUTH_COOKIE)

        if not token:
            logger.warning("No token found in cookies")
            return None

        return self.authenticate(request, token)

    def authenticate(self, request: HttpRequest, token: str) -> Optional[AbstractUser]:
        """Authenticate using the token from cookies"""
        try:
            return self.jwt_authenticate(request, token)
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            raise e

cookie_auth = CookieJWTAuth()