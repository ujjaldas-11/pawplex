from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AdoptionListing, AdoptionRequest, LostFound
from .serializers import (
    AdoptionListingSerializer,
    AdoptionListingListSerializer,
    AdoptionRequestSerializer,
    LostFoundSerializer,
)


class AdoptionListingViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = AdoptionListing.objects.filter(status='available')
        # Filter by species
        species = self.request.query_params.get('species')
        if species:
            queryset = queryset.filter(species=species)
        # Filter by gender
        gender = self.request.query_params.get('gender')
        if gender:
            queryset = queryset.filter(gender=gender)
        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return AdoptionListingListSerializer
        return AdoptionListingSerializer

    def perform_create(self, serializer):
        serializer.save(shelter=self.request.user)

    # POST /api/adoption/{id}/interest/
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def interest(self, request, pk=None):
        listing = self.get_object()

        if listing.status != 'available':
            return Response(
                {'error': 'This pet is no longer available'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check already requested
        if AdoptionRequest.objects.filter(listing=listing, requester=request.user).exists():
            return Response(
                {'error': 'You already expressed interest in this pet'},
                status=status.HTTP_400_BAD_REQUEST
            )

        adoption_request = AdoptionRequest.objects.create(
            listing=listing,
            requester=request.user,
            message=request.data.get('message', '')
        )

        return Response(
            AdoptionRequestSerializer(adoption_request).data,
            status=status.HTTP_201_CREATED
        )

    # PATCH /api/adoption/{id}/approve_request/
    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def approve_request(self, request, pk=None):
        listing  = self.get_object()
        req_id   = request.data.get('request_id')

        try:
            adoption_request = AdoptionRequest.objects.get(id=req_id, listing=listing)
        except AdoptionRequest.DoesNotExist:
            return Response({'error': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)

        adoption_request.status = request.data.get('status', 'approved')
        adoption_request.save()

        # If approved — mark listing as adopted
        if adoption_request.status == 'approved':
            listing.status = 'adopted'
            listing.save()

        return Response(AdoptionRequestSerializer(adoption_request).data)


class LostFoundViewSet(viewsets.ModelViewSet):
    serializer_class   = LostFoundSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = LostFound.objects.filter(is_resolved=False)
        # Filter by type (lost/found)
        type_filter = self.request.query_params.get('type')
        if type_filter:
            queryset = queryset.filter(type=type_filter)
        # Filter by species
        species = self.request.query_params.get('species')
        if species:
            queryset = queryset.filter(species=species)
        return queryset

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)

    # PATCH /api/lost-found/{id}/resolve/
    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def resolve(self, request, pk=None):
        report = self.get_object()
        report.is_resolved = True
        report.save()
        return Response({'message': 'Marked as resolved ✅'})