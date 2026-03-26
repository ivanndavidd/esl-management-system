from rest_framework import serializers
from .models import Product, ProductVariant


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'variant_number', 'ram', 'rom', 'unit_price', 'installment']


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'product_id', 'product_type', 'brand', 'commercial_name',
            'colour', 'usp_1', 'usp_2', 'usp_3', 'usp_4',
            'variants', 'created_at', 'updated_at'
        ]
