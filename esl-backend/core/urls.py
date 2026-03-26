from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/branches/', include('branches.urls')),
    path('api/products/', include('products.urls')),
    path('api/brands/', include('brands.urls')),
    path('api/categories/', include('categories.urls')),
    path('api/planogram/', include('planogram.urls')),
]
