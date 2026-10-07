import secrets

from django.contrib.auth.models import User

from apps.accounts.repositories.email_verification_repository import (
    EmailVerificationRepository,
)


class EmailVerificationService:

    @staticmethod
    def generate_verification_token(user):

        token = secrets.token_urlsafe(48)

        verification = (
            EmailVerificationRepository.create_token(
                user=user,
                token=token,
            )
        )

        return verification

    @staticmethod
    def verify_email(token):

        verification = (
            EmailVerificationRepository.get_valid_token(
                token
            )
        )

        if verification is None:
            raise ValueError(
                "Invalid or expired verification token."
            )

        user = verification.user

        user.is_active = True
        user.save(update_fields=["is_active"])

        EmailVerificationRepository.mark_as_used(
            verification
        )

        return user