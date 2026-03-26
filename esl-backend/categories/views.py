from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import USPCategory
from .serializers import USPCategorySerializer


class USPCategoryListView(generics.ListCreateAPIView):
    queryset = USPCategory.objects.all()
    serializer_class = USPCategorySerializer
    permission_classes = [IsAuthenticated]


class USPCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = USPCategory.objects.all()
    serializer_class = USPCategorySerializer
    permission_classes = [IsAuthenticated]
