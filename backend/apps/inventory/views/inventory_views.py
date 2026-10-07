from common.pagination.custom_pagination import StandardPagination

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.inventory.serializers import (
    InventorySerializer,
    InventoryUpdateSerializer,
)
from apps.inventory.services import InventoryService


class InventoryListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        inventory = InventoryService.get_all_inventory()

        paginator = StandardPagination()

        paginated_inventory = paginator.paginate_queryset(
            inventory,
            request
        )

        serializer = InventorySerializer(
            paginated_inventory,
            many=True
        )

        return paginator.get_paginated_response(
            serializer.data
        )

    def post(self, request):

        serializer = InventorySerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            inventory = InventoryService.create_inventory(
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
            InventorySerializer(inventory).data,
            status=status.HTTP_201_CREATED
        )


class InventoryDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, inventory_id):

        try:

            inventory = InventoryService.get_inventory(
                inventory_id
            )

        except ValueError as error:

            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            InventorySerializer(inventory).data,
            status=status.HTTP_200_OK
        )

    def put(self, request, inventory_id):

        serializer = InventoryUpdateSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            inventory = InventoryService.update_inventory(
                inventory_id,
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
            InventorySerializer(inventory).data,
            status=status.HTTP_200_OK
        )