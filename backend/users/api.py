from ninja_extra import api_controller, route
from ninja_jwt.controller import TokenObtainPairController
from ninja_jwt.tokens import RefreshToken
from django.http import HttpResponse, JsonResponse

from core.authentication import CookieJWTAuth
from core import settings
from .schema import (
    MyTokenObtainPairSchema,
    MyTokenObtainPairOutSchema,
    UserCreateSchema,
    UserSchema,
    TokenResponseSchema
)

from ninja_extra import api_controller, route
from django.contrib.auth import get_user_model
from django.utils.encoding import force_bytes
from django.db import transaction
from ninja_extra.exceptions import APIException
from core.authentication import cookie_auth

User = get_user_model()

@api_controller('/auth', tags=['Auth'], auth=cookie_auth)
class AuthController(TokenObtainPairController):
    @route.post("/login", response=MyTokenObtainPairOutSchema, url_name="login", auth=None)
    def obtain_token(self, user_token: MyTokenObtainPairSchema):
        token_data = user_token.output_schema()

        response = HttpResponse(token_data.model_dump_json())
        response.content_type = "application/json"

        # Set cookies
        response.set_cookie(
            key=settings.AUTH_COOKIE,
            value=token_data.access,
            max_age=settings.AUTH_COOKIE_MAX_AGE,
            path=settings.AUTH_COOKIE_PATH,
            secure=settings.AUTH_COOKIE_SECURE,
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            samesite=settings.AUTH_COOKIE_SAMESITE,
        )
        response.set_cookie(
            key=settings.REFRESH_COOKIE,
            value=token_data.refresh,
            max_age=settings.AUTH_COOKIE_MAX_AGE,
            path=settings.AUTH_COOKIE_PATH,
            secure=settings.AUTH_COOKIE_SECURE,
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            samesite=settings.AUTH_COOKIE_SAMESITE,
        )

        return response

    @route.post("/refresh", response={200: TokenResponseSchema, 401: TokenResponseSchema}, auth=None)
    def refresh_token(self, request):
        """Refresh access token using refresh token from cookie"""
        try:
            refresh_token = request.COOKIES.get(settings.REFRESH_COOKIE)
            if not refresh_token:
                raise APIException(detail="Refresh token not found", code=401)

            # Create refresh token instance
            refresh = RefreshToken(refresh_token)

            # Generate new access token
            access_token = str(refresh.access_token)

            response = JsonResponse({
                "detail": "Token refreshed successfully"
            })

            # Set new access token in cookie
            response.set_cookie(
                key=settings.AUTH_COOKIE,
                value=access_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
            )

            return response

        except Exception as e:
            return 401, {"detail": str(e)}

    @route.post("/logout", response={204: None})
    def logout(self, request):
        """Logout user by clearing auth cookies"""
        response = HttpResponse(status=204)

        # Delete both access and refresh cookies
        response.delete_cookie(
            key=settings.AUTH_COOKIE,
            path=settings.AUTH_COOKIE_PATH,
            samesite=settings.AUTH_COOKIE_SAMESITE
        )
        response.delete_cookie(
            key=settings.REFRESH_COOKIE,
            path=settings.AUTH_COOKIE_PATH,
            samesite=settings.AUTH_COOKIE_SAMESITE
        )

        return response

    @route.post("/register", response=UserSchema, auth=None)
    @transaction.atomic
    def register(self, request, data: UserCreateSchema):
        if User.objects.filter(email=data.email).exists():
            return self.create_response("Email already registered", status_code=400)

        user = User.objects.create_user(
            email=data.email,
            password=data.password,
            first_name=data.first_name,
            last_name=data.last_name,
            is_active=True  # Requires activation
        )

        return user

    @route.get("/me", response={200: UserSchema})
    def get_user(self, request):
        """Get the current authenticated user's information"""
        return UserSchema.from_orm(request.user)

