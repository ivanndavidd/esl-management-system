from django.urls import path
from . import views

urlpatterns = [
    path('sites/', views.SiteListCreateView.as_view(), name='site-list'),
    path('sites/<int:pk>/', views.SiteDetailView.as_view(), name='site-detail'),
    path('sites/<int:site_id>/segments/', views.SegmentListCreateView.as_view(), name='segment-list'),
    path('sites/<int:site_id>/segments/<int:pk>/', views.SegmentDetailView.as_view(), name='segment-detail'),
    path('segments/<int:segment_id>/devices/', views.ESLDeviceListView.as_view(), name='device-list'),
    path('segments/<int:segment_id>/devices/<int:pk>/', views.ESLDeviceDetailView.as_view(), name='device-detail'),
    path('segments/<int:segment_id>/devices/<int:pk>/bind/', views.ESLDeviceBindProductView.as_view(), name='device-bind'),
    path('segments/<int:segment_id>/devices/import/', views.ESLDeviceImportView.as_view(), name='device-import'),
    path('segments/<int:segment_id>/devices/batch/', views.ESLDeviceBatchActionView.as_view(), name='device-batch'),
    path('templates/', views.ESLTemplateListView.as_view(), name='template-list'),
    path('templates/<int:pk>/', views.ESLTemplateDetailView.as_view(), name='template-detail'),
]
