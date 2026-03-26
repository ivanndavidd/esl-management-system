from django.db import models
from accounts.models import User


class Branch(models.Model):
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=20, unique=True)
    location = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'branches'
        verbose_name_plural = 'branches'

    def __str__(self):
        return f'{self.code} - {self.name}'


class UserBranchAccess(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='branch_accesses')
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='user_accesses')
    granted_at = models.DateTimeField(auto_now_add=True)
    granted_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='granted_accesses'
    )

    class Meta:
        db_table = 'user_branch_access'
        unique_together = ('user', 'branch')

    def __str__(self):
        return f'{self.user.name} -> {self.branch.name}'
