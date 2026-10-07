from django.urls import path

from apps.members.views import (
    MemberListCreateAPIView,
    MemberDetailAPIView,
)


urlpatterns = [
    path(
        "",
        MemberListCreateAPIView.as_view(),
        name="member-list-create",
    ),

    path(
        "<int:member_id>/",
        MemberDetailAPIView.as_view(),
        name="member-detail",
    ),
]