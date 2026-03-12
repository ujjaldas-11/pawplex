from rest_framework import serializers
from .models import AdoptionListing, AdoptionRequest, LostFound


class AdoptionRequestSerializer(serializers.ModelSerializer):
    requester_username = serializers.CharField(source='requester.username', read_only=True)

    class Meta:
        model  = AdoptionRequest
        fields = ['id', 'listing', 'requester', 'requester_username', 'message', 'status', 'created_at']
        read_only_fields = ['id', 'requester', 'status', 'created_at']


class AdoptionListingSerializer(serializers.ModelSerializer):
    shelter_username = serializers.CharField(source='shelter.username', read_only=True)
    requests         = AdoptionRequestSerializer(many=True, read_only=True)

    class Meta:
        model  = AdoptionListing
        fields = [
            'id', 'shelter', 'shelter_username', 'pet_name',
            'species', 'breed', 'age_months', 'gender',
            'description', 'photo', 'status',
            'created_at', 'updated_at', 'requests'
        ]
        read_only_fields = ['id', 'shelter', 'created_at', 'updated_at']


class AdoptionListingListSerializer(serializers.ModelSerializer):
    shelter_username = serializers.CharField(source='shelter.username', read_only=True)

    class Meta:
        model  = AdoptionListing
        fields = ['id', 'shelter_username', 'pet_name', 'species', 'breed', 'age_months', 'gender', 'photo', 'status']


class LostFoundSerializer(serializers.ModelSerializer):
    reporter_username = serializers.CharField(source='reporter.username', read_only=True)

    class Meta:
        model  = LostFound
        fields = [
            'id', 'reporter', 'reporter_username', 'type',
            'pet_name', 'species', 'description', 'photo',
            'lat', 'lng', 'address', 'contact',
            'is_resolved', 'created_at'
        ]
        read_only_fields = ['id', 'reporter', 'created_at']