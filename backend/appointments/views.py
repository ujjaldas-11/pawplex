# appointments/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import VetClinic, AvailableSlot, Appointment
from .serializers import (
    VetClinicSerializer,
    AvailableSlotSerializer,
    AppointmentSerializer,
    AppointmentStatusSerializer,
)


class VetClinicViewSet(viewsets.ModelViewSet):
    serializer_class   = VetClinicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return VetClinic.objects.filter(is_open=True)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class AvailableSlotViewSet(viewsets.ModelViewSet):
    serializer_class   = AvailableSlotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AvailableSlot.objects.filter(
            clinic__id=self.kwargs.get('clinic_pk'),
            is_booked=False
        )

    def create(self, request, *args, **kwargs):
        print('REQUEST DATA:', request.data)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        try:
            clinic = VetClinic.objects.get(
                pk=self.kwargs['clinic_pk'],
                owner=self.request.user
            )
        except VetClinic.DoesNotExist:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You do not own this clinic')
        serializer.save(clinic=clinic)


class AppointmentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'update_status':
            return AppointmentStatusSerializer
        return AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'vet':
            return Appointment.objects.filter(clinic__owner=user)
        return Appointment.objects.filter(pet__owner=user)

    def perform_create(self, serializer):
        appointment = serializer.save()
        if appointment.slot:
            appointment.slot.is_booked = True
            appointment.slot.save()

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        appointment = self.get_object()
        serializer  = AppointmentStatusSerializer(
            appointment,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)