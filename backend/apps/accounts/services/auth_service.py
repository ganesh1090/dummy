from django.contrib.auth import authenticate
from django.contrib.auth.forms import PasswordResetForm
from rest_framework.authtoken.models import Token

from apps.accounts.repositories.user_repository import UserRepository
from apps.accounts.services.email_verification_service import (
    EmailVerificationService,
)


class AuthService:

    # ==========================================================
    # REGISTER
    # ==========================================================

    @staticmethod
    def register_user(
        username,
        email,
        password,
    ):

        if UserRepository.get_by_username(username):
            raise ValueError(
                "Username already exists."
            )

        if UserRepository.get_by_email(email):
            raise ValueError(
                "Email already exists."
            )

        user = UserRepository.create_user(
            username=username,
            email=email,
            password=password,
        )

        verification = (
            EmailVerificationService.generate_verification_token(
                user
            )
        )

        return user, verification

    # ==========================================================
    # LOGIN
    # ==========================================================

    @staticmethod
    def authenticate_user(
        username,
        password,
    ):

        user = authenticate(
            username=username,
            password=password,
        )

        if user is None:
            return None

        token, _ = Token.objects.get_or_create(
            user=user
        )

        return user, token

    # ==========================================================
    # PASSWORD RESET
    # ==========================================================

    @staticmethod
    def request_password_reset(
        email,
        request,
    ):

        user = UserRepository.get_active_by_email(
            email
        )

        if user is None:
            raise ValueError(
                "No active account was found with this email address."
            )

        form = PasswordResetForm(
            data={
                "email": email
            }
        )

        if form.is_valid():

            form.save(
                request=request,
                use_https=request.is_secure(),
            )

        return True