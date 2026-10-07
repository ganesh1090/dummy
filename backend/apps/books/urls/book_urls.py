from django.urls import path

from apps.books.views import (
    BookListCreateAPIView,
    BookDetailAPIView,
)


urlpatterns = [

    path(
        "",
        BookListCreateAPIView.as_view(),
        name="book-list-create",
    ),

    path(
        "<int:book_id>/",
        BookDetailAPIView.as_view(),
        name="book-detail",
    ),

]