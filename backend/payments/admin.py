from django.contrib import admin
from .models import StripeCustomer, Plan, Subscription, Payment

@admin.register(StripeCustomer)
class StripeCustomerAdmin(admin.ModelAdmin):
    list_display = ('user', 'stripe_customer_id', 'created_at')
    search_fields = ('user__email', 'stripe_customer_id')
    readonly_fields = ('stripe_customer_id', 'created_at', 'updated_at')

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'currency', 'is_active', 'created_at')
    list_filter = ('is_active', 'currency')
    search_fields = ('name', 'stripe_price_id')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'status', 'current_period_start', 'current_period_end', 'cancel_at_period_end')
    list_filter = ('status', 'cancel_at_period_end', 'plan')
    search_fields = ('user__email', 'stripe_subscription_id')
    readonly_fields = ('stripe_subscription_id', 'created_at', 'updated_at')
    date_hierarchy = 'created_at'

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'currency', 'status', 'created_at')
    list_filter = ('status', 'currency')
    search_fields = ('user__email', 'stripe_payment_intent_id')
    readonly_fields = ('stripe_payment_intent_id', 'created_at', 'updated_at')
    date_hierarchy = 'created_at'