from apps.notifications.models import Notification


class NotificationRepository:

    @staticmethod
    def get_all():
        return Notification.objects.select_related(
            "recipient"
        ).all()

    @staticmethod
    def get_by_id(notification_id):
        return (
            Notification.objects.select_related(
                "recipient"
            )
            .filter(id=notification_id)
            .first()
        )

    @staticmethod
    def get_by_recipient(recipient):
        return (
            Notification.objects.select_related(
                "recipient"
            )
            .filter(recipient=recipient)
            .order_by("-created_at")
        )

    @staticmethod
    def get_unread_by_recipient(recipient):
        return (
            Notification.objects.select_related(
                "recipient"
            )
            .filter(
                recipient=recipient,
                is_read=False,
            )
            .order_by("-created_at")
        )

    @staticmethod
    def create(data):
        return Notification.objects.create(
            **data
        )

    @staticmethod
    def update(notification, data):
        for field, value in data.items():
            setattr(notification, field, value)

        notification.save()

        return notification

    @staticmethod
    def bulk_update_read(notifications, updated_at):
        Notification.objects.filter(
            id__in=[
                notification.id
                for notification in notifications
            ]
        ).update(
            is_read=True,
            updated_at=updated_at,
        )
        
    @staticmethod
    def delete(notification):
        notification.delete()