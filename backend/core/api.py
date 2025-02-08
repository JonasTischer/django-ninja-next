from ninja_extra import NinjaExtraAPI
from ninja.errors import ValidationError
from users.api import UserController
from ninja_jwt.controller import NinjaJWTDefaultController
from ninja_jwt.authentication import JWTAuth

api = NinjaExtraAPI(auth=JWTAuth())
api.register_controllers(UserController)
api.register_controllers(NinjaJWTDefaultController)


@api.exception_handler(ValidationError)
def custom_validation_errors(request, exc):
    return api.create_response(request, {"detail": exc.errors}, status=422)