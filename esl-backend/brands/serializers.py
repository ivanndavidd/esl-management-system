from rest_framework import serializers
from .models import BrandLogo


class BrandLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrandLogo
        fields = ['id', 'brand', 'logo_url', 'created_at', 'updated_at']
