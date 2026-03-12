from rest_framework import serializers
from .models import Pet, VaccinationRecord, MedicalRecord
from .utils import generate_qr_code


class VaccinationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model  = VaccinationRecord
        fields = '__all__'
        read_only_fields = ['pet']


class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MedicalRecord
        fields = '__all__'
        read_only_fields = ['pet']


class PetSerializer(serializers.ModelSerializer):
    vaccinations    = VaccinationRecordSerializer(many=True, read_only=True)
    medical_records = MedicalRecordSerializer(many=True, read_only=True)
    owner_username  = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model  = Pet
        fields = [
            'id', 'owner', 'owner_username', 'name', 'species',
            'breed', 'dob', 'gender', 'weight', 'photo',
            'microchip_id', 'qr_code', 'is_active',
            'created_at', 'updated_at',
            'vaccinations', 'medical_records',
        ]
        read_only_fields = ['id', 'owner', 'qr_code', 'created_at', 'updated_at']

    def create(self, validated_data):
        pet = Pet.objects.create(**validated_data)
        generate_qr_code(pet)
        return pet


class PetListSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Pet
        fields = ['id', 'name', 'species', 'breed', 'photo', 'is_active']