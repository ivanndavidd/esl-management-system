from rest_framework import serializers
from .models import Site, LayoutSegment, ESLDevice, ESLTemplate
from products.models import Product


class ESLTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ESLTemplate
        fields = ['id', 'template_id', 'label', 'description', 'category', 'variant_count']


class ESLDeviceSerializer(serializers.ModelSerializer):
    product_id = serializers.CharField(source='product.product_id', read_only=True, allow_null=True)
    product_name = serializers.SerializerMethodField()
    product_type = serializers.CharField(source='product.product_type', read_only=True, allow_null=True)
    variant_count = serializers.SerializerMethodField()
    variants = serializers.SerializerMethodField()

    class Meta:
        model = ESLDevice
        fields = ['id', 'segment', 'product', 'product_id', 'product_name', 'product_type',
                  'variant_count', 'variants', 'code', 'barcode', 'template', 'ap', 'desc', 'created_at', 'updated_at']
        read_only_fields = ['segment', 'created_at', 'updated_at']

    def get_product_name(self, obj):
        if obj.product:
            return f'{obj.product.brand} {obj.product.commercial_name}'
        return None

    def get_variant_count(self, obj):
        if obj.product:
            return obj.product.variants.count()
        return None

    def get_variants(self, obj):
        if not obj.product:
            return []
        return [
            {'variant_number': v.variant_number, 'ram': v.ram, 'rom': v.rom}
            for v in obj.product.variants.all()
        ]


class LayoutSegmentSerializer(serializers.ModelSerializer):
    device_count = serializers.SerializerMethodField()

    class Meta:
        model = LayoutSegment
        fields = ['id', 'site', 'name', 'esl_type', 'device_count', 'created_at', 'updated_at']
        read_only_fields = ['site', 'created_at', 'updated_at']

    def get_device_count(self, obj):
        return obj.devices.count()


class SiteSerializer(serializers.ModelSerializer):
    segments = LayoutSegmentSerializer(many=True, read_only=True)
    segment_count = serializers.SerializerMethodField()

    class Meta:
        model = Site
        fields = ['id', 'name', 'location', 'segment_count', 'segments', 'created_at', 'updated_at']

    def get_segment_count(self, obj):
        return obj.segments.count()


class SiteListSerializer(serializers.ModelSerializer):
    segment_count = serializers.SerializerMethodField()

    class Meta:
        model = Site
        fields = ['id', 'name', 'location', 'segment_count', 'created_at', 'updated_at']

    def get_segment_count(self, obj):
        return obj.segments.count()
