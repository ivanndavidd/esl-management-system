from rest_framework.permissions import BasePermission
from .models import Role


class IsDeveloper(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == Role.DEVELOPER


class IsSuperAdminOrAbove(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            Role.DEVELOPER, Role.SUPER_ADMIN
        ]


class IsAdminOrAbove(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            Role.DEVELOPER, Role.SUPER_ADMIN, Role.ADMIN
        ]


class IsAnyAuthenticatedUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated
