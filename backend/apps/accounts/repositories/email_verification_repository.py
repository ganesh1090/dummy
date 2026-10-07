from datetime import timedelta

from django.utils import timezone

from apps.accounts.models.email_verification import (
    EmailVerificationToken,
)


class EmailVerificationRepository:

    @staticmethod
    def create_token(user, token):
        return EmailVerificationToken.objects.create(
            user=user,
            token=token,
            expires_at=timezone.now() + timedelta(hours=24),
        )

    @staticmethod
    def get_valid_token(token):
        verification = (
            EmailVerificationToken.objects
            .select_related("user")
            .filter(
                token=token,
                used_at__isnull=True,
            )
            .first()
        )

        if verification is None:
            return None

        if verification.is_expired:
            return None

        return verification

    @staticmethod
    def mark_as_used(verification):
        verification.used_at = timezone.now()
        verification.save(
            update_fields=["used_at"]
        )