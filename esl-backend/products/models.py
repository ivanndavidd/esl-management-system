from django.db import models


class Product(models.Model):
    PRODUCT_TYPE_DEMO = 'demo'
    PRODUCT_TYPE_ACCESSORY = 'accessory'
    PRODUCT_TYPE_CHOICES = [
        (PRODUCT_TYPE_DEMO, 'Demo Item'),
        (PRODUCT_TYPE_ACCESSORY, 'Accessories Item'),
    ]

    product_id = models.CharField(max_length=50, unique=True, editable=False)
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPE_CHOICES, default=PRODUCT_TYPE_DEMO)
    brand = models.CharField(max_length=100)
    commercial_name = models.CharField(max_length=200)
    colour = models.TextField(blank=True, default='')
    usp_1 = models.TextField(blank=True, default='')
    usp_2 = models.TextField(blank=True, default='')
    usp_3 = models.TextField(blank=True, default='')
    usp_4 = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        ordering = ['product_id']

    def __str__(self):
        return f'{self.product_id} - {self.brand} {self.commercial_name}'

    def save(self, *args, **kwargs):
        if not self.product_id and self.product_type == self.PRODUCT_TYPE_DEMO:
            count = Product.objects.filter(product_type=self.PRODUCT_TYPE_DEMO).count()
            self.product_id = f'DEMOITEM{count + 1:03d}'
        super().save(*args, **kwargs)


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    variant_number = models.PositiveIntegerField()
    ram = models.CharField(max_length=20, blank=True, default='')
    rom = models.CharField(max_length=20, blank=True, default='')
    unit_price = models.BigIntegerField(null=True, blank=True)
    installment = models.BigIntegerField(null=True, blank=True)

    class Meta:
        db_table = 'product_variants'
        ordering = ['variant_number']
        unique_together = ('product', 'variant_number')

    def __str__(self):
        return f'{self.product.product_id} V{self.variant_number} {self.ram}/{self.rom}'
