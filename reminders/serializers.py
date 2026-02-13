from rest_framework import serializers
from .models import Reminder

class ReminderSerializer(serializers.ModelSerializer):
    loan_name = serializers.ReadOnlyField(source='payment.loan.loan_name')
    emi_amount = serializers.ReadOnlyField(source='payment.emi_amount')
    
    class Meta:
        model = Reminder
        fields = '__all__'
