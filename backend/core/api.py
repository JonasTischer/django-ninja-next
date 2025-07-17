from ninja.errors import ValidationError
from ninja_extra import NinjaExtraAPI
from ninja_jwt.controller import NinjaJWTDefaultController

from payments.api import PaymentsController, WebhooksController
from users.api import AuthController

api = NinjaExtraAPI()
api.register_controllers(AuthController)
api.register_controllers(PaymentsController)
api.register_controllers(WebhooksController)
api.register_controllers(NinjaJWTDefaultController)


@api.exception_handler(ValidationError)
def custom_validation_errors(request, exc):
    return api.create_response(request, {"detail": exc.errors}, status=422)
