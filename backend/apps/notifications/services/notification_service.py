from apps.notifications.repositories import (
    NotificationRepository,
)


class NotificationService:

    @staticmethod
    def get_all_notifications():
        return NotificationRepository.get_all()

    @staticmethod
    def get_notification(notification_id):
        notification = (
            NotificationRepository.get_by_id(
                notification_id
            )
        )

        if notification is None:
            raise ValueError(
                "Notification not found."
            )

        return notification

    @staticmethod
    def get_user_notifications(user):
        return NotificationRepository.get_by_recipient(
            user
        )

    @staticmethod
    def get_unread_notifications(user):
        return (
            NotificationRepository.get_unread_by_recipient(
                user
            )
        )

    @staticmethod
    def create_notification(
        recipient,
        notification_type,
        title,
        message,
        link="",
    ):
        return NotificationRepository.create(
            {
                "recipient": recipient,
                "notification_type": notification_type,
                "title": title,
                "message": message,
                "link": link,
            }
        )

    @staticmethod
    def mark_as_read(notification_id):
        notification = (
            NotificationService.get_notification(
                notification_id
            )
        )

        return NotificationRepository.update(
            notification,
            {
                "is_read": True,
            }
        )

    @staticmethod
    def mark_as_unread(notification_id):
        notification = (
            NotificationService.get_notification(
                notification_id
            )
        )

        return NotificationRepository.update(
            notification,
            {
                "is_read": False,
            }
        )

    @staticmethod
    def mark_all_as_read(user):
        notifications = (
            NotificationRepository.get_unread_by_recipient(
                user
            )
        )

        for notification in notifications:
            notification.is_read = True

        if notifications:
            from django.utils import timezone

            NotificationRepository.bulk_update_read(
                notifications,
                timezone.now(),
            )

        return notifications