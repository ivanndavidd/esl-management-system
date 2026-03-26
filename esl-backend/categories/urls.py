from django.urls import path
from . import views

urlpatterns = [
    path('', views.USPCategoryListView.as_view(), name='usp-category-list'),
    path('<int:pk>/', views.USPCategoryDetailView.as_view(), name='usp-category-detail'),
]
