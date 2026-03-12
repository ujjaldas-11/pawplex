from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'owner'


class IsVet(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'vet'


class IsShelter(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'shelter'


class IsStore(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'store'


class IsVetOrShelterOrStore(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in['vet', 'shelter', 'store']
