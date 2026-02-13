from rest_framework import serializers
from .models import Loan

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = '__all__'
        read_only_fields = ('emi_amount', 'user')

    def create(self, validated_data):
        # We handle creation via service in the view, but this is for direct use if needed.
        # However, as per requirements, business logic should be in services.py.
        return super().create(validated_data)
