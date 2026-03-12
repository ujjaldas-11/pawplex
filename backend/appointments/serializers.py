from rest_framework import serializers
from .models import VetClinic, Appointment, AvailableSlot


class VetClinicSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    class Meta:
        model  = VetClinic
        fields = [
            'id', 'owner', 'owner_username', 'name',
            'address', 'phone', 'email',
            'lat', 'lng', 'is_open', 'created_at'
        ]
        read_only_fields = ['id', 'owner', 'created_at']


class AvailableSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailableSlot
        fields = ['id', 'clinic', 'start_time', 'end_time', 'is_booked']
        read_only_fields = ['id', 'is_booked', 'clinic']
    

class AppointmentSerializer(serializers.ModelSerializer):
    pet_name    = serializers.CharField(source='pet.name',    read_only=True)
    clinic_name = serializers.CharField(source='clinic.name', read_only=True)

    class Meta:
        model  = Appointment
        fields = [
            'id', 'pet', 'pet_name', 'clinic', 'clinic_name',
            'slot', 'date_time', 'reason', 'status',
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

    def validate(self, attrs):
        # Check slot is not already booked
        slot = attrs.get('slot')
        if slot and slot.is_booked:
            raise serializers.ValidationError({'slot': 'This slot is already booked'})
        return attrs

class AppointmentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'status', 'notes']