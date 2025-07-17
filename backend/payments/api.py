import stripe
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpResponse
from ninja_extra import api_controller, route
from ninja_extra.exceptions import APIException
from ninja_jwt.authentication import JWTAuth

from .models import Plan
from .schemas import (
    CancelSubscriptionResponseSchema,
    CancelSubscriptionSchema,
    CheckoutSessionResponseSchema,
    CreateCheckoutSessionSchema,
    CustomerPortalResponseSchema,
    CustomerPortalSchema,
    PlanSchema,
    SubscriptionSchema,
    UserSubscriptionSchema,
)
from .services import StripeService

User = get_user_model()


@api_controller("/payments", tags=["Payments"])
class PaymentsController:
    @route.get("/plans", response=list[PlanSchema], auth=None, operation_id="get_plans")
    def get_plans(self, request):
        """Get all available subscription plans"""
        plans = Plan.objects.filter(is_active=True)
        return [PlanSchema.from_orm(plan) for plan in plans]

    @route.get(
        "/subscription",
        response=UserSubscriptionSchema,
        auth=JWTAuth(),
        operation_id="get_user_subscription",
    )
    def get_user_subscription(self, request):
        """Get user's current subscription status"""
        subscription = StripeService.get_user_subscription(request.user)

        if subscription:
            return UserSubscriptionSchema(
                has_active_subscription=True,
                subscription=SubscriptionSchema.from_orm(subscription),
                plan_name=subscription.plan.name,
            )
        else:
            return UserSubscriptionSchema(
                has_active_subscription=False, subscription=None, plan_name=None
            )

    @route.post(
        "/checkout",
        response=CheckoutSessionResponseSchema,
        auth=JWTAuth(),
        operation_id="create_checkout_session",
    )
    def create_checkout_session(self, request, data: CreateCheckoutSessionSchema):
        """Create a Stripe checkout session for subscription"""
        try:
            plan = Plan.objects.get(id=data.plan_id, is_active=True)
        except Plan.DoesNotExist:
            raise APIException(detail="Plan not found", code=404) from None

        # Check if user already has active subscription
        existing_subscription = StripeService.get_user_subscription(request.user)
        if existing_subscription:
            raise APIException(
                detail="User already has an active subscription", code=400
            )

        try:
            session_data = StripeService.create_checkout_session(
                user=request.user,
                plan=plan,
                success_url=data.success_url,
                cancel_url=data.cancel_url,
            )

            return CheckoutSessionResponseSchema(**session_data)

        except Exception as e:
            raise APIException(
                detail=f"Error creating checkout session: {str(e)}", code=500
            ) from e

    @route.post(
        "/cancel",
        response=CancelSubscriptionResponseSchema,
        auth=JWTAuth(),
        operation_id="cancel_subscription",
    )
    def cancel_subscription(self, request, data: CancelSubscriptionSchema):
        """Cancel user's subscription"""
        result = StripeService.cancel_subscription(request.user, data.subscription_id)

        if result["success"]:
            return CancelSubscriptionResponseSchema(**result)
        else:
            raise APIException(detail=result["message"], code=400)

    @route.post(
        "/portal",
        response=CustomerPortalResponseSchema,
        auth=JWTAuth(),
        operation_id="create_customer_portal",
    )
    def create_customer_portal(self, request, data: CustomerPortalSchema):
        """Create a Stripe customer portal session"""
        try:
            portal_data = StripeService.create_customer_portal_session(
                user=request.user, return_url=data.return_url
            )

            return CustomerPortalResponseSchema(**portal_data)

        except Exception as e:
            raise APIException(
                detail=f"Error creating customer portal: {str(e)}", code=500
            ) from e


@api_controller("/payments/webhooks", tags=["Webhooks"])
class WebhooksController:
    @route.post("/stripe", auth=None, operation_id="stripe_webhook")
    def stripe_webhook(self, request):
        """Handle Stripe webhook events"""
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            # Invalid payload
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError:
            # Invalid signature
            return HttpResponse(status=400)

        # Handle the event
        try:
            if event["type"] == "checkout.session.completed":
                # session = event['data']['object']
                # Handle successful payment
                # The subscription will be created via subscription.created event
                pass

            elif event["type"] == "customer.subscription.created":
                subscription = event["data"]["object"]
                StripeService.handle_subscription_created(subscription)

            elif event["type"] == "customer.subscription.updated":
                subscription = event["data"]["object"]
                StripeService.handle_subscription_updated(subscription)

            elif event["type"] == "customer.subscription.deleted":
                subscription = event["data"]["object"]
                StripeService.handle_subscription_deleted(subscription)

            elif event["type"] == "invoice.payment_succeeded":
                # invoice = event['data']['object']
                # Handle successful payment
                pass

            elif event["type"] == "invoice.payment_failed":
                # invoice = event['data']['object']
                # Handle failed payment
                pass

            else:
                print(f"Unhandled event type: {event['type']}")

        except Exception as e:
            print(f"Error handling webhook: {str(e)}")
            return HttpResponse(status=500)

        return HttpResponse(status=200)
