from django.contrib.auth.models import User


class UserRepository:

    @staticmethod
    def get_by_username(username):
        return User.objects.filter(
            username=username
        ).first()

    @staticmethod
    def get_by_email(email):
        return User.objects.filter(
            email=email
        ).first()

    @staticmethod
    def get_active_by_email(email):
        return User.objects.filter(
            email=email,
            is_active=True
        ).first()

    @staticmethod
    def create_user(
    username,
    email,
    password
):
     return User.objects.create_user(
        username=username,
        email=email,
        password=password,
        is_active=False,
    )