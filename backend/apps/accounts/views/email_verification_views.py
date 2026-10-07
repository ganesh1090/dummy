from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.services import EmailVerificationService
from apps.notifications.services import EmailService


class VerifyEmailAPIView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, token):

        try:

            user = EmailVerificationService.verify_email(
                token
            )

        except ValueError as error:

            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "message": "Email verified successfully.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                }
            },
            status=status.HTTP_200_OK
        )


class ResendVerificationAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get("email")

        if not email:

            return Response(
                {
                    "detail": "Email is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(
            email=email,
            is_active=False,
        ).first()

        if user is None:

            return Response(
                {
                    "detail": (
                        "No inactive account was found "
                        "with this email address."
                    )
                },
                status=status.HTTP_404_NOT_FOUND
            )

        verification = (
            EmailVerificationService.resend_verification(
                user
            )
        )

        EmailService.send_verification_email(
            user=user,
            token=verification.token,
            request=request,
        )

        return Response(
            {
                "message": (
                    "A new verification email has been sent."
                )
            },
            status=status.HTTP_200_OK
        )