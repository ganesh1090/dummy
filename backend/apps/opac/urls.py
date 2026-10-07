from django.urls import path

from apps.opac.views import (
    OPACListAPIView,
    OPACDetailAPIView,
)


urlpatterns = [
    path(
        "",
        OPACListAPIView.as_view(),
        name="opac-list",
    ),

    path(
        "<str:title_id>/",
        OPACDetailAPIView.as_view(),
        name="opac-detail",
    ),
]