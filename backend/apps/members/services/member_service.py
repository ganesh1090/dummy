from django.contrib.auth.models import User
from django.db import transaction

from apps.members.repositories import MemberRepository


class MemberService:

    @staticmethod
    def get_all_members():
        return MemberRepository.get_all()

    @staticmethod
    def get_member(member_id):
        member = MemberRepository.get_by_id(member_id)

        if member is None:
            raise ValueError(
                "Member not found."
            )

        return member

    @staticmethod
    @transaction.atomic
    def create_member(data):

        data = data.copy()

        member_code = data["member_id"]

        existing_member = (
            MemberRepository.get_by_member_id(
                member_code
            )
        )

        if existing_member:
            raise ValueError(
                "A member with this member ID already exists."
            )

        name = data.pop("name", "").strip()
        email = data.pop("email", "").strip()

        if not email:
            raise ValueError(
                "Email is required."
            )

        if User.objects.filter(
            email__iexact=email
        ).exists():
            raise ValueError(
                "A user with this email already exists."
            )

        username = member_code

        if User.objects.filter(
            username=username
        ).exists():
            raise ValueError(
                "A user with this Member ID already exists."
            )

        name_parts = name.split()

        first_name = name_parts[0] if name_parts else ""
        last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""

        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
        )

        # The member does not receive a default password.
        # Password can be established later through the
        # existing password-reset/account workflow.
        user.set_unusable_password()
        user.save(
            update_fields=[
                "password",
            ]
        )

        data["user"] = user

        return MemberRepository.create(data)

    @staticmethod
    @transaction.atomic
    def update_member(member_id, data):

        member = MemberService.get_member(
            member_id
        )

        data = data.copy()

        if "member_id" in data:

            existing_member = (
                MemberRepository.get_by_member_id(
                    data["member_id"]
                )
            )

            if (
                existing_member
                and existing_member.id != member.id
            ):
                raise ValueError(
                    "A member with this member ID already exists."
                )

        name = data.pop("name", None)
        email = data.pop("email", None)

        user = member.user

        if name is not None:

            name = name.strip()
            name_parts = name.split()

            user.first_name = (
                name_parts[0]
                if name_parts
                else ""
            )

            user.last_name = (
                " ".join(name_parts[1:])
                if len(name_parts) > 1
                else ""
            )

        if email is not None:

            email = email.strip()

            if not email:
                raise ValueError(
                    "Email is required."
                )

            existing_user = (
                User.objects
                .filter(
                    email__iexact=email
                )
                .exclude(
                    id=user.id
                )
                .first()
            )

            if existing_user:
                raise ValueError(
                    "A user with this email already exists."
                )

            user.email = email

        user.save()

        return MemberRepository.update(
            member,
            data
        )

    @staticmethod
    def delete_member(member_id):

        member = MemberService.get_member(
            member_id
        )

        return MemberRepository.delete(member)