from django.urls import include, path

from .book_urls import urlpatterns as book_urlpatterns


urlpatterns = [
    path(
        "",
        include(book_urlpatterns),
    ),

    path(
        "titles/",
        include("apps.books.urls.title_urls"),
    ),
]