from ninja_extra import NinjaExtraAPI
from ninja.errors import ValidationError
from users.api import AuthController
from payments.api import PaymentsController, WebhooksController
from ninja_jwt.controller import NinjaJWTDefaultController

api = NinjaExtraAPI()
api.register_controllers(AuthController)
api.register_controllers(PaymentsController)
api.register_controllers(WebhooksController)
api.register_controllers(NinjaJWTDefaultController)


@api.exception_handler(ValidationError)
def custom_validation_errors(request, exc):
    return api.create_response(request, {"detail": exc.errors}, status=422)