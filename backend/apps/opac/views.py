from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.opac.services import OPACService


class OPACListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):

        search = request.query_params.get(
            "search"
        )

        category = request.query_params.get(
            "category"
        )

        media_type = request.query_params.get(
            "media_type"
        )

        available_param = request.query_params.get(
            "available"
        )

        available = None

        if available_param == "true":
            available = True

        elif available_param == "false":
            available = False

        catalogue = OPACService.get_catalogue(
            search=search,
            category=category,
            media_type=media_type,
            available=available,
        )

        return Response(
            {
                "count": len(catalogue),
                "results": catalogue,
            },
            status=status.HTTP_200_OK,
        )


class OPACDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, title_id):

        title = OPACService.get_title_details(
            title_id
        )

        if title is None:
            return Response(
                {
                    "detail": "Title not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            title,
            status=status.HTTP_200_OK,
        )