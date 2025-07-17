import stripe
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from typing import Dict, Any
from .models import StripeCustomer, Plan, Subscription

User = get_user_model()

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeService:
    """Service class for handling Stripe operations"""

    @staticmethod
    def get_or_create_customer(user: User) -> StripeCustomer:
        """Get or create a Stripe customer for the user"""
        try:
            stripe_customer = StripeCustomer.objects.get(user=user)
            return stripe_customer
        except StripeCustomer.DoesNotExist:
            # Create customer in Stripe
            customer = stripe.Customer.create(
                email=user.email,
                name=f"{user.first_name} {user.last_name}",
                metadata={
                    'user_id': user.id,
                }
            )

            # Create local customer record
            stripe_customer = StripeCustomer.objects.create(
                user=user,
                stripe_customer_id=customer.id
            )

            return stripe_customer

    @staticmethod
    def create_checkout_session(user: User, plan: Plan, success_url: str, cancel_url: str) -> Dict[str, Any]:
        """Create a Stripe checkout session for subscription"""
        stripe_customer = StripeService.get_or_create_customer(user)

        session = stripe.checkout.Session.create(
            customer=stripe_customer.stripe_customer_id,
            payment_method_types=['card'],
            line_items=[{
                'price': plan.stripe_price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                'user_id': user.id,
                'plan_id': plan.id,
            }
        )

        return {
            'session_id': session.id,
            'session_url': session.url,
        }

    @staticmethod
    def handle_subscription_created(stripe_subscription: Dict[str, Any]) -> Subscription:
        """Handle subscription.created webhook"""
        user_id = stripe_subscription['metadata'].get('user_id')
        plan_id = stripe_subscription['metadata'].get('plan_id')

        if not user_id or not plan_id:
            raise ValueError("Missing user_id or plan_id in metadata")

        user = User.objects.get(id=user_id)
        plan = Plan.objects.get(id=plan_id)

        subscription = Subscription.objects.create(
            user=user,
            stripe_subscription_id=stripe_subscription['id'],
            plan=plan,
            status=stripe_subscription['status'],
            current_period_start=timezone.datetime.fromtimestamp(
                stripe_subscription['current_period_start'],
                tz=timezone.timezone.utc
            ),
            current_period_end=timezone.datetime.fromtimestamp(
                stripe_subscription['current_period_end'],
                tz=timezone.timezone.utc
            ),
            cancel_at_period_end=stripe_subscription.get('cancel_at_period_end', False)
        )

        return subscription

    @staticmethod
    def handle_subscription_updated(stripe_subscription: Dict[str, Any]) -> Subscription:
        """Handle subscription.updated webhook"""
        subscription = Subscription.objects.get(
            stripe_subscription_id=stripe_subscription['id']
        )

        subscription.status = stripe_subscription['status']
        subscription.current_period_start = timezone.datetime.fromtimestamp(
            stripe_subscription['current_period_start'],
            tz=timezone.timezone.utc
        )
        subscription.current_period_end = timezone.datetime.fromtimestamp(
            stripe_subscription['current_period_end'],
            tz=timezone.timezone.utc
        )
        subscription.cancel_at_period_end = stripe_subscription.get('cancel_at_period_end', False)
        subscription.save()

        return subscription

    @staticmethod
    def handle_subscription_deleted(stripe_subscription: Dict[str, Any]) -> Subscription:
        """Handle subscription.deleted webhook"""
        subscription = Subscription.objects.get(
            stripe_subscription_id=stripe_subscription['id']
        )

        subscription.status = 'canceled'
        subscription.save()

        return subscription

    @staticmethod
    def cancel_subscription(user: User, subscription_id: str) -> Dict[str, Any]:
        """Cancel a user's subscription"""
        try:
            subscription = Subscription.objects.get(
                user=user,
                stripe_subscription_id=subscription_id
            )

            # Cancel in Stripe
            stripe.Subscription.modify(
                subscription_id,
                cancel_at_period_end=True
            )

            # Update local record
            subscription.cancel_at_period_end = True
            subscription.save()

            return {
                'success': True,
                'message': 'Subscription will be canceled at the end of the current period'
            }

        except Subscription.DoesNotExist:
            return {
                'success': False,
                'message': 'Subscription not found'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error canceling subscription: {str(e)}'
            }

    @staticmethod
    def get_user_subscription(user: User) -> Subscription:
        """Get user's current active subscription"""
        try:
            return Subscription.objects.get(
                user=user,
                status__in=['active', 'trialing']
            )
        except Subscription.DoesNotExist:
            return None

    @staticmethod
    def create_customer_portal_session(user: User, return_url: str) -> Dict[str, Any]:
        """Create a Stripe customer portal session"""
        stripe_customer = StripeService.get_or_create_customer(user)

        session = stripe.billing_portal.Session.create(
            customer=stripe_customer.stripe_customer_id,
            return_url=return_url,
        )

        return {
            'session_url': session.url
        }