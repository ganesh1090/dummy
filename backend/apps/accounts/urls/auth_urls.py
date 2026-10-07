from django.contrib.auth import views as auth_views
from django.urls import path

from apps.accounts.views.auth_views import (
    RegisterAPIView,
    LoginAPIView,
    LogoutAPIView,
    PasswordResetRequestAPIView,
)

from apps.accounts.views.email_verification_views import (
    ResendVerificationAPIView,
)


urlpatterns = [

    path(
        "register/",
        RegisterAPIView.as_view(),
        name="register",
    ),

    path(
        "login/",
        LoginAPIView.as_view(),
        name="login",
    ),

    path(
        "logout/",
        LogoutAPIView.as_view(),
        name="logout",
    ),

    path(
        "password-reset/",
        PasswordResetRequestAPIView.as_view(),
        name="password_reset",
    ),

    path(
        "resend-verification/",
        ResendVerificationAPIView.as_view(),
        name="resend_verification",
    ),

    # Password reset link
    path(
        "reset/<uidb64>/<token>/",
        auth_views.PasswordResetConfirmView.as_view(
            template_name="accounts/password_reset_confirm.html",
        ),
        name="password_reset_confirm",
    ),

    # Password reset completed
    path(
        "reset/done/",
        auth_views.PasswordResetCompleteView.as_view(
            template_name="accounts/password_reset_complete.html",
        ),
        name="password_reset_complete",
    ),

]