from common.pagination.custom_pagination import StandardPagination

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from common.permissions import IsStaffUser
from apps.books.serializers import BookSerializer
from apps.books.services import BookService


class BookListCreateAPIView(APIView):

    def get_permissions(self):
        """
        GET  -> authenticated users
        POST -> staff users
        """

        if self.request.method == "GET":
            return [IsAuthenticated()]

        return [IsAuthenticated(), IsStaffUser()]

    def get(self, request):

        search = request.query_params.get("search")
        author = request.query_params.get("author")
        publisher = request.query_params.get("publisher")

        available_param = request.query_params.get(
            "available"
        )

        available = None

        if available_param == "true":
            available = True

        elif available_param == "false":
            available = False

        books = BookService.get_all_books(
            search=search,
            author=author,
            publisher=publisher,
            available=available,
        )

        paginator = StandardPagination()

        paginated_books = paginator.paginate_queryset(
            books,
            request
        )

        serializer = BookSerializer(
            paginated_books,
            many=True
        )

        return paginator.get_paginated_response(
            serializer.data
        )

    def post(self, request):

        serializer = BookSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            book = BookService.create_book(
                serializer.validated_data
            )

        except ValueError as error:

            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            BookSerializer(book).data,
            status=status.HTTP_201_CREATED
        )


class BookDetailAPIView(APIView):

    def get_permissions(self):
        """
        GET    -> authenticated users
        PUT    -> staff users
        DELETE -> staff users
        """

        if self.request.method == "GET":
            return [IsAuthenticated()]

        return [IsAuthenticated(), IsStaffUser()]

    def get(self, request, book_id):

        try:

            book = BookService.get_book(
                book_id
            )

        except ValueError as error:

            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            BookSerializer(book).data,
            status=status.HTTP_200_OK
        )

    def put(self, request, book_id):

        try:

            book = BookService.get_book(
                book_id
            )

        except ValueError as error:

            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookSerializer(
            book,
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            updated_book = BookService.update_book(
                book_id,
                serializer.validated_data
            )

        except ValueError as error:

            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            BookSerializer(updated_book).data,
            status=status.HTTP_200_OK
        )

    def delete(self, request, book_id):

        try:

            BookService.delete_book(
                book_id
            )

        except ValueError as error:

            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {
                "message": "Book deleted successfully."
            },
            status=status.HTTP_200_OK
        )