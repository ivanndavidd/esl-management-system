from rest_framework import serializers
from .models import USPCategory


class USPCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = USPCategory
        fields = ['id', 'name', 'icon_url', 'keywords', 'created_at', 'updated_at']
