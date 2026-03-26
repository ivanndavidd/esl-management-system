from django.urls import path
from . import views

urlpatterns = [
    path('', views.BrandLogoListView.as_view(), name='brand-logo-list'),
    path('<int:pk>/', views.BrandLogoDetailView.as_view(), name='brand-logo-detail'),
]
