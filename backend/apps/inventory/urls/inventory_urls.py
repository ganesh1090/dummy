from django.urls import path

from apps.inventory.views import (
    InventoryListCreateAPIView,
    InventoryDetailAPIView,
)


urlpatterns = [
    path(
        "",
        InventoryListCreateAPIView.as_view(),
        name="inventory-list-create",
    ),

    path(
        "<int:inventory_id>/",
        InventoryDetailAPIView.as_view(),
        name="inventory-detail",
    ),
]