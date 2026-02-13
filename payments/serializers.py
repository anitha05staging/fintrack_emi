from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    loan_name = serializers.ReadOnlyField(source='loan.loan_name')
    
    class Meta:
        model = Payment
        fields = '__all__'
