from django.urls import path
from .views import (
    BranchListCreateView, BranchDetailView,
    UserBranchAccessListView, UserBranchAccessDeleteView,
    MyBranchesView,
)

urlpatterns = [
    path('', BranchListCreateView.as_view(), name='branch_list'),
    path('<int:pk>/', BranchDetailView.as_view(), name='branch_detail'),
    path('my-branches/', MyBranchesView.as_view(), name='my_branches'),
    path('access/', UserBranchAccessListView.as_view(), name='branch_access_list'),
    path('access/<int:pk>/', UserBranchAccessDeleteView.as_view(), name='branch_access_delete'),
]
