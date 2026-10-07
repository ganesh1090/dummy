from django.urls import path

from apps.branches.views import (
    BranchListCreateAPIView,
    BranchDetailAPIView,
)


urlpatterns = [
    path(
        "",
        BranchListCreateAPIView.as_view(),
        name="branch-list-create",
    ),

    path(
        "<str:branch_id>/",
        BranchDetailAPIView.as_view(),
        name="branch-detail",
    ),
]