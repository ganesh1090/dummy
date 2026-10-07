from apps.branches.models import Branch


class BranchRepository:

    @staticmethod
    def get_all():
        return Branch.objects.all()

    @staticmethod
    def get_by_id(branch_id):
        return Branch.objects.filter(
            id=branch_id
        ).first()

    @staticmethod
    def get_by_name(name):
        return Branch.objects.filter(
            name__iexact=name
        ).first()

    @staticmethod
    def create(data):
        return Branch.objects.create(**data)

    @staticmethod
    def update(branch, data):
        for field, value in data.items():
            setattr(branch, field, value)

        branch.save()

        return branch

    @staticmethod
    def delete(branch):
        branch.delete()