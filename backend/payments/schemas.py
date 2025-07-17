from datetime import datetime
from decimal import Decimal

from ninja import Schema


class PlanSchema(Schema):
    id: int
    name: str
    price: Decimal
    currency: str
    description: str
    features: list[str]
    is_active: bool


class SubscriptionSchema(Schema):
    id: int
    plan: PlanSchema
    status: str
    current_period_start: datetime
    current_period_end: datetime
    cancel_at_period_end: bool


class UserSubscriptionSchema(Schema):
    has_active_subscription: bool
    subscription: SubscriptionSchema | None = None
    plan_name: str | None = None


class CreateCheckoutSessionSchema(Schema):
    plan_id: int
    success_url: str
    cancel_url: str


class CheckoutSessionResponseSchema(Schema):
    session_id: str
    session_url: str


class CancelSubscriptionSchema(Schema):
    subscription_id: str


class CancelSubscriptionResponseSchema(Schema):
    success: bool
    message: str


class CustomerPortalSchema(Schema):
    return_url: str


class CustomerPortalResponseSchema(Schema):
    session_url: str


class WebhookEventSchema(Schema):
    """Schema for Stripe webhook events"""

    pass  # This will be validated by Stripe directly
