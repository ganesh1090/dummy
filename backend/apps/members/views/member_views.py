from common.pagination.custom_pagination import StandardPagination

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from common.permissions import IsStaffUser
from apps.members.serializers import MemberSerializer
from apps.members.services import MemberService


class MemberListCreateAPIView(APIView):

    def get_permissions(self):
        """
        GET  -> authenticated users
        POST -> staff users
        """

        if self.request.method == "GET":
            return [IsAuthenticated()]

        return [IsAuthenticated(), IsStaffUser()]

    def get(self, request):

        members = MemberService.get_all_members()

        paginator = StandardPagination()

        paginated_members = paginator.paginate_queryset(
            members,
            request
        )

        serializer = MemberSerializer(
            paginated_members,
            many=True
        )

        return paginator.get_paginated_response(
            serializer.data
        )

    def post(self, request):

        serializer = MemberSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            member = MemberService.create_member(
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
            MemberSerializer(member).data,
            status=status.HTTP_201_CREATED
        )


class MemberDetailAPIView(APIView):

    def get_permissions(self):
        """
        GET    -> authenticated users
        PUT    -> staff users
        DELETE -> staff users
        """

        if self.request.method == "GET":
            return [IsAuthenticated()]

        return [IsAuthenticated(), IsStaffUser()]

    def get(self, request, member_id):

        try:

            member = MemberService.get_member(
                member_id
            )

        except ValueError as error:

            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            MemberSerializer(member).data,
            status=status.HTTP_200_OK
        )

    def put(self, request, member_id):

        try:

            member = MemberService.get_member(
                member_id
            )

        except ValueError as error:

            return Response(
                {
                    "detail": str(error)
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = MemberSerializer(
            member,
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            updated_member = MemberService.update_member(
                member_id,
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
            MemberSerializer(updated_member).data,
            status=status.HTTP_200_OK
        )

    def delete(self, request, member_id):

        try:

            MemberService.delete_member(
                member_id
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
                "message": "Member deleted successfully."
            },
            status=status.HTTP_200_OK
        )