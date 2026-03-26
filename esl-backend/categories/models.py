from django.db import models


class USPCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon_url = models.TextField(blank=True, default='')
    keywords = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'usp_categories'
        ordering = ['name']

    def __str__(self):
        return self.name
