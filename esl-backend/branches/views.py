from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from accounts.permissions import IsSuperAdminOrAbove, IsAdminOrAbove, IsDeveloper
from accounts.models import Role
from .models import Branch, UserBranchAccess
from .serializers import BranchSerializer, UserBranchAccessSerializer


class BranchListCreateView(generics.ListCreateAPIView):
    serializer_class = BranchSerializer
    permission_classes = [IsSuperAdminOrAbove]

    def get_queryset(self):
        user = self.request.user
        if user.role in [Role.DEVELOPER, Role.SUPER_ADMIN]:
            return Branch.objects.all()
        # Admin/User see only their branches
        return Branch.objects.filter(user_accesses__user=user, is_active=True)


class BranchDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [IsSuperAdminOrAbove]


class UserBranchAccessListView(generics.ListCreateAPIView):
    serializer_class = UserBranchAccessSerializer
    permission_classes = [IsSuperAdminOrAbove]

    def get_queryset(self):
        return UserBranchAccess.objects.select_related('user', 'branch').all()


class UserBranchAccessDeleteView(generics.DestroyAPIView):
    queryset = UserBranchAccess.objects.all()
    permission_classes = [IsSuperAdminOrAbove]


class MyBranchesView(APIView):
    """Returns branches accessible by the current user."""

    def get(self, request):
        user = request.user
        if user.role in [Role.DEVELOPER, Role.SUPER_ADMIN]:
            branches = Branch.objects.filter(is_active=True)
        else:
            branches = Branch.objects.filter(
                user_accesses__user=user, is_active=True
            )
        serializer = BranchSerializer(branches, many=True)
        return Response(serializer.data)
