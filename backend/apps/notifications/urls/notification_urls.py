from django.urls import path

from apps.notifications.views import (
    NotificationListAPIView,
    UnreadNotificationListAPIView,
    NotificationDetailAPIView,
    MarkNotificationAsReadAPIView,
    MarkNotificationAsUnreadAPIView,
    MarkAllNotificationsAsReadAPIView,
)


urlpatterns = [
    path(
        "",
        NotificationListAPIView.as_view(),
        name="notification-list",
    ),
    path(
        "unread/",
        UnreadNotificationListAPIView.as_view(),
        name="notification-unread",
    ),
    path(
        "read-all/",
        MarkAllNotificationsAsReadAPIView.as_view(),
        name="notification-read-all",
    ),
    path(
        "<int:notification_id>/",
        NotificationDetailAPIView.as_view(),
        name="notification-detail",
    ),
    path(
        "<int:notification_id>/read/",
        MarkNotificationAsReadAPIView.as_view(),
        name="notification-read",
    ),
    path(
        "<int:notification_id>/unread/",
        MarkNotificationAsUnreadAPIView.as_view(),
        name="notification-unread-detail",
    ),
]