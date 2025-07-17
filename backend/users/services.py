import requests
from allauth.socialaccount.models import SocialAccount
from django.conf import settings
from django.contrib.auth import get_user_model
from ninja_extra.exceptions import APIException
from ninja_jwt.tokens import RefreshToken

User = get_user_model()


class SocialAuthService:
    """Service for handling social authentication with allauth"""

    @staticmethod
    def authenticate_with_google(credential: str, request=None):
        """
        Authenticate user with Google JWT credential (ID token)
        """
        try:
            # Verify the JWT token with Google
            response = requests.get(
                f"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={credential}",
                timeout=10,
            )

            if response.status_code != 200:
                raise APIException(detail="Invalid Google credential", code=400)

            token_info = response.json()

            # Verify the token is for our app
            if token_info.get("aud") != settings.GOOGLE_OAUTH2_CLIENT_ID:
                raise APIException(detail="Invalid token audience", code=400)

            # Extract user information
            user_data = {
                "id": token_info.get("sub"),
                "email": token_info.get("email"),
                "given_name": token_info.get("given_name", ""),
                "family_name": token_info.get("family_name", ""),
                "picture": token_info.get("picture", ""),
                "email_verified": token_info.get("email_verified", False),
            }

            # Check if user exists by email
            email = user_data.get("email")
            if not email:
                raise APIException(detail="No email provided by Google", code=400)

            try:
                # Try to get existing user
                user = User.objects.get(email=email)

                # Check if social account exists
                social_account, created = SocialAccount.objects.get_or_create(
                    user=user,
                    provider="google",
                    uid=user_data.get("id"),
                    defaults={"extra_data": user_data},
                )

            except User.DoesNotExist:
                # Create new user
                user = User.objects.create_user(
                    email=email,
                    first_name=user_data.get("given_name", ""),
                    last_name=user_data.get("family_name", ""),
                    is_active=True,
                )

                # Create social account
                SocialAccount.objects.create(
                    user=user,
                    provider="google",
                    uid=user_data.get("id"),
                    extra_data=user_data,
                )

            return user

        except Exception as e:
            if isinstance(e, APIException):
                raise
            raise APIException(
                detail=f"Google authentication failed: {str(e)}", code=400
            ) from e

    @staticmethod
    def generate_jwt_tokens(user):
        """Generate JWT tokens for authenticated user"""
        refresh = RefreshToken.for_user(user)
        return {"access": str(refresh.access_token), "refresh": str(refresh)}
