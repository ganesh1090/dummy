from django.urls import path

from apps.fines.views import (
    FineListAPIView,
    FineDetailAPIView,
    CreateFineAPIView,
    PayFineAPIView,
)


urlpatterns = [
    path(
        "",
        FineListAPIView.as_view(),
        name="fine-list",
    ),

    path(
        "create/",
        CreateFineAPIView.as_view(),
        name="fine-create",
    ),

    path(
        "<int:fine_id>/",
        FineDetailAPIView.as_view(),
        name="fine-detail",
    ),

    path(
        "<int:fine_id>/pay/",
        PayFineAPIView.as_view(),
        name="fine-pay",
    ),
]