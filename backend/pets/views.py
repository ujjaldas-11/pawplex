from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Pet, VaccinationRecord, MedicalRecord
from .serializers import (
    PetSerializer,
    PetListSerializer,
    VaccinationRecordSerializer,
    MedicalRecordSerializer,
)
from .utils import generate_qr_code


class PetViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Owner only sees their own pets
        return Pet.objects.filter(owner=self.request.user, is_active=True)

    def get_serializer_class(self):
        # Lightweight serializer for list, full for detail
        if self.action == 'list':
            return PetListSerializer
        return PetSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def destroy(self, request, *args, **kwargs):
        # Soft delete — don't actually remove from DB
        pet = self.get_object()
        pet.is_active = False
        pet.save()
        return Response({'message': f'{pet.name} removed'}, status=status.HTTP_204_NO_CONTENT)
                               
    # GET /api/pets/{id}/qr/
    @action(detail=True, methods=['get'])
    def qr(self, request, pk=None):
        pet = self.get_object()
        if not pet.qr_code:
            generate_qr_code(pet)
        return Response({'qr_code': request.build_absolute_uri(pet.qr_code.url)})

    # GET /api/pets/{id}/health_card/
    @action(detail=True, methods=['get'])
    def health_card(self, request, pk=None):
        pet = self.get_object()
        serializer = PetSerializer(pet, context={'request': request})
        return Response(serializer.data)


class VaccinationViewSet(viewsets.ModelViewSet):
    serializer_class   = VaccinationRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return VaccinationRecord.objects.filter(
            pet__owner=self.request.user,
            pet__id=self.kwargs.get('pet_pk')
        )

    def perform_create(self, serializer):
        pet = Pet.objects.get(pk=self.kwargs['pet_pk'], owner=self.request.user)
        serializer.save(pet=pet)


class MedicalRecordViewSet(viewsets.ModelViewSet):
    serializer_class   = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MedicalRecord.objects.filter(
            pet__owner=self.request.user,
            pet__id=self.kwargs.get('pet_pk')
        )

    def perform_create(self, serializer):
        pet = Pet.objects.get(pk=self.kwargs['pet_pk'], owner=self.request.user)
        serializer.save(pet=pet)