from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import BrandLogo
from .serializers import BrandLogoSerializer


class BrandLogoListView(generics.ListCreateAPIView):
    queryset = BrandLogo.objects.all()
    serializer_class = BrandLogoSerializer
    permission_classes = [IsAuthenticated]


class BrandLogoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BrandLogo.objects.all()
    serializer_class = BrandLogoSerializer
    permission_classes = [IsAuthenticated]
