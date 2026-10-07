from django.conf import settings
from django.db import models


class Notification(models.Model):

    NOTIFICATION_TYPE_CHOICES = [
        ("INFO", "Information"),
        ("DUE_SOON", "Due Soon"),
        ("OVERDUE", "Overdue"),
        ("HOLD_READY", "Hold Ready"),
        ("FINE", "Fine"),
        ("MEMBER_REQUEST", "Member Request"),
        ("SYSTEM", "System"),
    ]

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    notification_type = models.CharField(
        max_length=30,
        choices=NOTIFICATION_TYPE_CHOICES,
        default="INFO",
    )

    title = models.CharField(
        max_length=255,
    )

    message = models.TextField()

    is_read = models.BooleanField(
        default=False,
    )

    link = models.CharField(
        max_length=500,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.recipient.username} - {self.title}"