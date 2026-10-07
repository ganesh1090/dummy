from django.conf import settings
from django.core.mail import send_mail


class EmailService:

    @staticmethod
    def send_verification_email(
        user,
        token,
        request,
    ):

        verification_url = (
            request.build_absolute_uri(
                f"/api/v1/auth/verify-email/{token}/"
            )
        )

        subject = "Verify your LibraryOS account"

        message = (
            f"Hello {user.username},\n\n"
            f"Thank you for registering with LibraryOS.\n\n"
            f"Please verify your email by clicking the link below:\n\n"
            f"{verification_url}\n\n"
            f"This verification link is valid for 24 hours.\n\n"
            f"If you did not create this account, "
            f"you can safely ignore this email.\n\n"
            f"LibraryOS Team"
        )

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
        )