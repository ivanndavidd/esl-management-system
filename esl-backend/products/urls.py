from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProductListView.as_view(), name='product-list'),
    path('<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('variants/<int:pk>/', views.ProductVariantDetailView.as_view(), name='variant-detail'),
    path('batch/delete/', views.ProductBatchDeleteView.as_view(), name='product-batch-delete'),
    path('import/', views.ImportProductCSVView.as_view(), name='product-import'),
    path('import/accessories/', views.ImportAccessoriesCSVView.as_view(), name='product-import-accessories'),
    path('export/demo/', views.ExportDemoItemCSVView.as_view(), name='product-export-demo'),
    path('export/accessories/', views.ExportAccessoriesItemView.as_view(), name='product-export-accessories'),
    path('debug/csv-headers/', views.DebugCSVHeadersView.as_view(), name='debug-csv-headers'),
]
