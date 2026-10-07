from rest_framework import status
from rest_framework.parsers import (
    JSONParser,
    FormParser,
    MultiPartParser,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.books.serializers import TitleSerializer
from apps.books.services import TitleService


class TitleListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        JSONParser,
        FormParser,
        MultiPartParser,
    ]

    def get(self, request):

        titles = TitleService.get_all_titles()

        serializer = TitleSerializer(
            titles,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):

        serializer = TitleSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            title = TitleService.create_title(
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
            TitleSerializer(title).data,
            status=status.HTTP_201_CREATED
        )


class TitleDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        JSONParser,
        FormParser,
        MultiPartParser,
    ]

    def get(self, request, title_id):

        try:

            title = TitleService.get_title(
                title_id
            )

        except ValueError as error:

            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            TitleSerializer(title).data,
            status=status.HTTP_200_OK
        )

    def put(self, request, title_id):

        try:

            title = TitleService.get_title(
                title_id
            )

        except ValueError as error:

            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = TitleSerializer(
            title,
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            updated_title = TitleService.update_title(
                title_id,
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
            TitleSerializer(updated_title).data,
            status=status.HTTP_200_OK
        )

    def delete(self, request, title_id):

        try:

            TitleService.delete_title(
                title_id
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
                "message": "Title deleted successfully."
            },
            status=status.HTTP_200_OK
        )