from apps.members.models import Member


class MemberRepository:

    @staticmethod
    def get_all():
        return Member.objects.filter(
            is_active=True
        ).select_related("user").order_by("member_id")

    @staticmethod
    def get_by_id(member_id):
        return (
            Member.objects
            .select_related("user")
            .filter(
                id=member_id,
                is_active=True,
            )
            .first()
        )

    @staticmethod
    def get_by_member_id(member_code):
        return Member.objects.filter(
            member_id=member_code
        ).first()

    @staticmethod
    def get_by_user_id(user_id):
        return Member.objects.filter(
            user_id=user_id
        ).first()

    @staticmethod
    def create(data):
        return Member.objects.create(
            **data
        )

    @staticmethod
    def update(member, data):

        for field, value in data.items():
            setattr(member, field, value)

        member.save()

        return member

    @staticmethod
    def delete(member):

        member.is_active = False

        member.save(
            update_fields=["is_active"]
        )

        return member