from django.db import models
from products.models import Product


class ESLTemplate(models.Model):
    CATEGORY_DEMO = 'demo'
    CATEGORY_ACCESSORY = 'accessory'
    CATEGORY_MAINTENANCE = 'maintenance'
    CATEGORY_CHOICES = [
        (CATEGORY_DEMO, 'Demo Item'),
        (CATEGORY_ACCESSORY, 'Accessories'),
        (CATEGORY_MAINTENANCE, 'UnderMaintenance'),
    ]

    template_id = models.IntegerField(unique=True)
    label = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default=CATEGORY_DEMO)
    variant_count = models.PositiveSmallIntegerField(null=True, blank=True)

    class Meta:
        db_table = 'esl_templates'
        ordering = ['template_id']

    def __str__(self):
        return f'{self.template_id} — {self.label}'


class Site(models.Model):
    name = models.CharField(max_length=200, unique=True)
    location = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'sites'
        ordering = ['name']

    def __str__(self):
        return self.name


class LayoutSegment(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='segments')
    name = models.CharField(max_length=200)
    esl_type = models.CharField(max_length=100, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'layout_segments'
        ordering = ['name']

    def __str__(self):
        return f'{self.site.name} — {self.name}'


class ESLDevice(models.Model):
    segment = models.ForeignKey(LayoutSegment, on_delete=models.CASCADE, related_name='devices')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='esl_devices')
    code = models.CharField(max_length=100)
    barcode = models.CharField(max_length=200)
    template = models.CharField(max_length=50, blank=True, default='')
    ap = models.CharField(max_length=100, blank=True, default='')
    desc = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'esl_devices'
        ordering = ['barcode']

    def __str__(self):
        return f'{self.barcode} ({self.segment.name})'
