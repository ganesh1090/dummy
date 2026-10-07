from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.serializers.auth import (
    RegisterSerializer,
    PasswordResetRequestSerializer,
)
from apps.accounts.services.auth_service import AuthService
from apps.notifications.services import EmailService


# ==========================================================
# REGISTER
# ==========================================================

class RegisterAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = RegisterSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            user, verification = AuthService.register_user(
                username=serializer.validated_data["username"],
                email=serializer.validated_data["email"],
                password=serializer.validated_data["password"],
            )

            EmailService.send_verification_email(
                user=user,
                token=verification.token,
                request=request,
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
                "message": (
                    "Account created successfully. "
                    "Please verify your email before logging in."
                ),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                }
            },
            status=status.HTTP_201_CREATED
        )


# ==========================================================
# LOGIN
# ==========================================================

class LoginAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:

            return Response(
                {
                    "detail": "Username and password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        result = AuthService.authenticate_user(
            username=username,
            password=password,
        )

        if result is None:

            return Response(
                {
                    "detail": "Invalid username or password."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        user, token = result

        return Response(
            {
                "message": "Login successful.",
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                }
            },
            status=status.HTTP_200_OK
        )


# ==========================================================
# LOGOUT
# ==========================================================

class LogoutAPIView(APIView):

    authentication_classes = [TokenAuthentication]

    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.auth:
            request.auth.delete()

        return Response(
            {
                "message": "Logout successful."
            },
            status=status.HTTP_200_OK
        )


# ==========================================================
# PASSWORD RESET REQUEST
# ==========================================================

class PasswordResetRequestAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = PasswordResetRequestSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            AuthService.request_password_reset(
                email=serializer.validated_data["email"],
                request=request,
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
                "message": (
                    "If the account exists, "
                    "a password reset email has been sent."
                )
            },
            status=status.HTTP_200_OK
        )