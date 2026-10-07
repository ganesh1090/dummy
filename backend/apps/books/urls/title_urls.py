from django.urls import path

from apps.books.views import (
    TitleListCreateAPIView,
    TitleDetailAPIView,
)


urlpatterns = [
    path(
        "",
        TitleListCreateAPIView.as_view(),
        name="title-list-create",
    ),

    path(
        "<str:title_id>/",
        TitleDetailAPIView.as_view(),
        name="title-detail",
    ),
]