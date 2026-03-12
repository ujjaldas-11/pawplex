from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import SOSAlert, EmergencyContact
from .serializers import SOSAlertSerializer, EmergencyContactSerializer, NearbyVetSerializer
from .utils import get_nearest_clinics


from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from notifications.models import Notification
from notifications.serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    serializer_class   = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)


class MarkReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            notification = Notification.objects.get(
                pk=pk,
                recipient=request.user
            )
            notification.is_read = True
            notification.save()
            return Response({'message': 'Marked as read ✅'})
        except Notification.DoesNotExist:
            return Response(
                {'error': 'Notification not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class MarkAllReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(
            recipient=request.user,
            is_read=False
        ).update(is_read=True)
        return Response({'message': 'All notifications marked as read ✅'})


class UnreadCountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(
            recipient=request.user,
            is_read=False
        ).count()
        return Response({'unread_count': count})

class SOSAlertView(generics.CreateAPIView):
    serializer_class   = SOSAlertSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        alert = serializer.save(owner=self.request.user)
        try:
            from notifications.tasks import send_sos_sms
            send_sos_sms.delay(alert.id)
        except Exception:
            pass

class SOSResolveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            alert = SOSAlert.objects.get(pk=pk, owner=request.user)
        except SOSAlert.DoesNotExist:
            return Response(
                {'error': 'SOS alert not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        alert.status      = 'resolved'
        alert.resolved_at = timezone.now()
        alert.save()
        return Response({'message': 'SOS resolved ✅'})


class SOSListView(generics.ListAPIView):
    serializer_class   = SOSAlertSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SOSAlert.objects.filter(owner=self.request.user)


class NearbyVetsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')

        if not lat or not lng:
            return Response(
                {'error': 'lat and lng query params are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            lat = float(lat)
            lng = float(lng)
        except ValueError:
            return Response(
                {'error': 'lat and lng must be valid numbers'},
                status=status.HTTP_400_BAD_REQUEST
            )

        clinics    = get_nearest_clinics(lat, lng)
        serializer = NearbyVetSerializer(clinics, many=True)
        return Response(serializer.data)


class EmergencyContactViewSet(viewsets.ModelViewSet):
    serializer_class   = EmergencyContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EmergencyContact.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)