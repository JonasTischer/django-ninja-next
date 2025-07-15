from django.core.management.base import BaseCommand
from payments.models import Plan

class Command(BaseCommand):
    help = 'Create sample subscription plans'

    def handle(self, *args, **options):
        # Create or update plans
        plans_data = [
            {
                'name': 'free',
                'stripe_price_id': 'price_free',  # Replace with actual Stripe price ID
                'price': 0.00,
                'currency': 'USD',
                'description': 'Free plan with basic features',
                'features': [
                    'Basic features',
                    'Limited usage',
                    'Community support'
                ]
            },
            {
                'name': 'pro',
                'stripe_price_id': 'price_pro',  # Replace with actual Stripe price ID
                'price': 9.99,
                'currency': 'USD',
                'description': 'Pro plan with advanced features',
                'features': [
                    'All basic features',
                    'Advanced analytics',
                    'Priority support',
                    'Custom integrations',
                    'API access'
                ]
            },
            {
                'name': 'enterprise',
                'stripe_price_id': 'price_enterprise',  # Replace with actual Stripe price ID
                'price': 29.99,
                'currency': 'USD',
                'description': 'Enterprise plan with premium features',
                'features': [
                    'All pro features',
                    'White-label options',
                    'Dedicated support',
                    'Custom development',
                    'SLA guarantee',
                    'Team collaboration'
                ]
            }
        ]

        for plan_data in plans_data:
            plan, created = Plan.objects.update_or_create(
                name=plan_data['name'],
                defaults=plan_data
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created plan: {plan.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Updated plan: {plan.name}')
                )

        self.stdout.write(
            self.style.SUCCESS('Successfully created/updated all plans')
        )

        self.stdout.write(
            self.style.WARNING(
                'Remember to update the stripe_price_id fields with actual Stripe price IDs!'
            )
        )