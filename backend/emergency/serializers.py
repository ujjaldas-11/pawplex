from rest_framework import serializers
from .models import SOSAlert, EmergencyContact


class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model  = EmergencyContact
        fields = ['id', 'user', 'name', 'phone', 'relation']
        read_only_fields = ['id', 'user']


class SOSAlertSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model  = SOSAlert
        fields = [
            'id', 'owner', 'owner_username',
            'lat', 'lng', 'address',
            'status', 'emergency_contact',
            'message', 'timestamp', 'resolved_at'
        ]
        read_only_fields = ['id', 'owner', 'status', 'timestamp', 'resolved_at']


class NearbyVetSerializer(serializers.Serializer):
    id       = serializers.IntegerField()
    name     = serializers.CharField()
    address  = serializers.CharField()
    phone    = serializers.CharField()
    lat      = serializers.FloatField()
    lng      = serializers.FloatField()
    distance = serializers.FloatField()