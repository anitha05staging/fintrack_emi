from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('loan', 'emi_number', 'due_date', 'status', 'emi_amount', 'principal_component', 'interest_component', 'penalty_amount', 'total_due_amount', 'outstanding_balance_after_payment')
    list_filter = ('status', 'due_date')
    search_fields = ('loan__loan_name',)
