from ninja import Schema
from ninja.errors import ValidationError
from ninja_jwt.schema import TokenObtainPairInputSchema  # updated base class
from pydantic import ValidationInfo, field_validator


class UserSchema(Schema):
    first_name: str
    last_name: str
    email: str


class UserCreateSchema(Schema):
    email: str
    password: str
    re_password: str
    first_name: str | None
    last_name: str | None

    @field_validator("re_password", mode="after")
    @classmethod
    def check_passwords_match(cls, value: str, info: ValidationInfo) -> str:
        if value != info.data["password"]:
            raise ValidationError("Passwords do not match")
        return value


class SocialAuthSchema(Schema):
    """Schema for social authentication"""

    credential: str  # JWT credential from Google (ID token)
    provider: str = "google"  # Default to google, can be extended for other providers


class MyTokenObtainPairOutSchema(Schema):
    access: str
    refresh: str
    user: UserSchema


class MyTokenObtainPairSchema(TokenObtainPairInputSchema):
    def output_schema(self):
        out_dict = self.get_response_schema_init_kwargs()
        out_dict.update(user=UserSchema.from_orm(self._user))
        return MyTokenObtainPairOutSchema(**out_dict)


class TokenResponseSchema(Schema):
    detail: str
    access: str
