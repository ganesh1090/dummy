from django.urls import include, path


urlpatterns = [

    path(
        "",
        include("apps.accounts.urls.auth_urls"),
    ),

    path(
        "verify-email/",
        include(
            "apps.accounts.urls.email_verification_urls"
        ),
    ),

]