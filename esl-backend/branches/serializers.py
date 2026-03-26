from rest_framework import serializers
from .models import Branch, UserBranchAccess
from accounts.serializers import UserSerializer


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'name', 'code', 'location', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserBranchAccessSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    branch = BranchSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        source='user', queryset=__import__('accounts.models', fromlist=['User']).User.objects.all(), write_only=True
    )
    branch_id = serializers.PrimaryKeyRelatedField(
        source='branch', queryset=Branch.objects.all(), write_only=True
    )

    class Meta:
        model = UserBranchAccess
        fields = ['id', 'user', 'branch', 'user_id', 'branch_id', 'granted_at']
        read_only_fields = ['id', 'granted_at']

    def create(self, validated_data):
        validated_data['granted_by'] = self.context['request'].user
        return super().create(validated_data)
