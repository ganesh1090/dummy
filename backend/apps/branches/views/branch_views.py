from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.branches.serializers import BranchSerializer
from apps.branches.services import BranchService


class BranchListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        branches = BranchService.get_all_branches()

        serializer = BranchSerializer(
            branches,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):

        serializer = BranchSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            branch = BranchService.create_branch(
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
            BranchSerializer(branch).data,
            status=status.HTTP_201_CREATED
        )


class BranchDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, branch_id):

        try:

            branch = BranchService.get_branch(
                branch_id
            )

        except ValueError as error:

            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            BranchSerializer(branch).data,
            status=status.HTTP_200_OK
        )

    def put(self, request, branch_id):

        try:

            branch = BranchService.get_branch(
                branch_id
            )

        except ValueError as error:

            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BranchSerializer(
            branch,
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            updated_branch = BranchService.update_branch(
                branch_id,
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
            BranchSerializer(updated_branch).data,
            status=status.HTTP_200_OK
        )

    def delete(self, request, branch_id):

        try:

            BranchService.delete_branch(
                branch_id
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
                "message": "Branch deleted successfully."
            },
            status=status.HTTP_200_OK
        )