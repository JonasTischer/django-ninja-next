from ninja_extra import api_controller, route
from ninja_jwt.controller import TokenObtainPairController
from ninja_jwt.tokens import RefreshToken
from django.http import HttpResponse, JsonResponse
from ninja_jwt.authentication import JWTAuth

from core import settings
from .schema import (
    UserCreateSchema,
    UserSchema,
)

from ninja_extra import api_controller, route
from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()

@api_controller('/auth', tags=['Auth'], auth=JWTAuth())
class UserController():

    # @route.post("/logout", response={204: None})
    # def logout(self, request):
    #     """Logout user by clearing auth cookies"""
    #     response = HttpResponse(status=204)

    #     # Delete both access and refresh cookies
    #     response.delete_cookie(
    #         key=settings.AUTH_COOKIE,
    #         path=settings.AUTH_COOKIE_PATH,
    #         samesite=settings.AUTH_COOKIE_SAMESITE
    #     )
    #     response.delete_cookie(
    #         key=settings.REFRESH_COOKIE,
    #         path=settings.AUTH_COOKIE_PATH,
    #         samesite=settings.AUTH_COOKIE_SAMESITE
    #     )

    #     return response

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

