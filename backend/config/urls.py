"""
URL configuration for config project.
"""

from django.contrib import admin
from django.urls import include, path


urlpatterns = [

    path(
        "admin/",
        admin.site.urls,
    ),

    path(
        "api/v1/auth/",
        include("apps.accounts.urls"),
    ),

    path(
        "api/v1/books/",
        include("apps.books.urls"),
    ),

    path(
        "api/v1/members/",
        include("apps.members.urls"),
    ),

    path(
        "api/v1/circulation/",
        include("apps.circulation.urls"),
    ),

    path(
        "api/v1/inventory/",
        include("apps.inventory.urls"),
    ),

    path(
        "api/v1/fines/",
        include("apps.fines.urls"),
    ),

    path(
        "api/v1/reports/",
        include("apps.reports.urls"),
    ),

    path(
        "api/v1/branches/",
        include("apps.branches.urls.branch_urls"),
    ),

    path(
    "api/v1/opac/",
    include("apps.opac.urls"),
),
]