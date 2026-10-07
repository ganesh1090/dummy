from django.urls import path

from apps.accounts.views.email_verification_views import (
    VerifyEmailAPIView,
)


urlpatterns = [

    path(
        "<str:token>/",
        VerifyEmailAPIView.as_view(),
        name="verify_email",
    ),

]