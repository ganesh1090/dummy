from django.conf import settings
from django.db import models
from django.utils import timezone


class EmailVerificationToken(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="email_verification_tokens",
    )

    token = models.CharField(
        max_length=128,
        unique=True,
    )

    expires_at = models.DateTimeField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    used_at = models.DateTimeField(
        null=True,
        blank=True
    )

    @property
    def is_expired(self):
        return timezone.now() >= self.expires_at

    @property
    def is_used(self):
        return self.used_at is not None

    def __str__(self):
        return f"Email verification for {self.user.username}"