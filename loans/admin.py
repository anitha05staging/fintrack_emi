from django.contrib import admin
from .models import Loan

@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ('loan_name', 'user', 'total_amount', 'emi_amount', 'status', 'start_date')
    search_fields = ('loan_name', 'user__username')
    list_filter = ('status', 'loan_type')
