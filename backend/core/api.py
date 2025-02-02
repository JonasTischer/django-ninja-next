from ninja_extra import NinjaExtraAPI
from ninja.errors import ValidationError
from .authentication import cookie_auth
from users.api import AuthController


api = NinjaExtraAPI(auth=cookie_auth)
api.register_controllers(AuthController)



@api.exception_handler(ValidationError)
def custom_validation_errors(request, exc):
    return api.create_response(request, {"detail": exc.errors}, status=422)