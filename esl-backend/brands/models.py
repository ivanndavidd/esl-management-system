from django.db import models


class BrandLogo(models.Model):
    brand = models.CharField(max_length=100, unique=True)
    logo_url = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'brand_logos'
        ordering = ['brand']

    def __str__(self):
        return self.brand
