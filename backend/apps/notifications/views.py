from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.notifications.serializers import NotificationSerializer
from apps.notifications.services import NotificationService


class NotificationListAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = NotificationService.get_user_notifications(
            request.user
        )

        serializer = NotificationSerializer(
            notifications,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class UnreadNotificationListAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = NotificationService.get_unread_notifications(
            request.user
        )

        serializer = NotificationSerializer(
            notifications,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class NotificationDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, notification_id):
        try:
            notification = NotificationService.get_notification(
                notification_id
            )
        except ValueError:
            return Response(
                {
                    "detail": "Notification not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if notification.recipient != request.user:
            return Response(
                {
                    "detail": "You do not have permission to access this notification."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = NotificationSerializer(
            notification
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class MarkNotificationAsReadAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, notification_id):
        try:
            notification = NotificationService.get_notification(
                notification_id
            )
        except ValueError:
            return Response(
                {
                    "detail": "Notification not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if notification.recipient != request.user:
            return Response(
                {
                    "detail": "You do not have permission to update this notification."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        notification = NotificationService.mark_as_read(
            notification_id
        )

        serializer = NotificationSerializer(
            notification
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class MarkNotificationAsUnreadAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, notification_id):
        try:
            notification = NotificationService.get_notification(
                notification_id
            )
        except ValueError:
            return Response(
                {
                    "detail": "Notification not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if notification.recipient != request.user:
            return Response(
                {
                    "detail": "You do not have permission to update this notification."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        notification = NotificationService.mark_as_unread(
            notification_id
        )

        serializer = NotificationSerializer(
            notification
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class MarkAllNotificationsAsReadAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request):
        NotificationService.mark_all_as_read(
            request.user
        )

        return Response(
            {
                "detail": "All notifications marked as read."
            },
            status=status.HTTP_200_OK,
        )