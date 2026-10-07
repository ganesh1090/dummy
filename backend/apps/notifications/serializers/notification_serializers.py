from rest_framework import serializers

from apps.notifications.models import Notification


class NotificationSerializer(serializers.ModelSerializer):

    notification_type_display = serializers.CharField(
        source="get_notification_type_display",
        read_only=True,
    )

    recipient_username = serializers.CharField(
        source="recipient.username",
        read_only=True,
    )

    class Meta:
        model = Notification

        fields = [
            "id",
            "recipient",
            "recipient_username",
            "notification_type",
            "notification_type_display",
            "title",
            "message",
            "is_read",
            "link",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "recipient_username",
            "notification_type_display",
            "created_at",
            "updated_at",
        ]