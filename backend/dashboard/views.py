from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # ── Pet Owner Dashboard ──────────────────────
        if user.role == 'owner':
            from pets.models import Pet, VaccinationRecord
            from appointments.models import Appointment
            from notifications.models import Notification

            pets       = Pet.objects.filter(owner=user, is_active=True)
            pets_count = pets.count()

            # Upcoming vaccinations in next 30 days
            due_date   = timezone.now().date() + timedelta(days=30)
            vac_due    = VaccinationRecord.objects.filter(
                pet__owner=user,
                next_due__lte=due_date,
                next_due__gte=timezone.now().date()
            ).count()

            # Appointments
            appointments_total   = Appointment.objects.filter(pet__owner=user).count()
            appointments_pending = Appointment.objects.filter(pet__owner=user, status='pending').count()
            appointments_upcoming = Appointment.objects.filter(
                pet__owner=user,
                status='confirmed',
                date_time__gte=timezone.now()
            ).count()

            # Unread notifications
            unread_notifications = Notification.objects.filter(
                recipient=user,
                is_read=False
            ).count()

            return Response({
                'role':                   'owner',
                'pets_count':             pets_count,
                'vaccinations_due':       vac_due,
                'appointments_total':     appointments_total,
                'appointments_pending':   appointments_pending,
                'appointments_upcoming':  appointments_upcoming,
                'unread_notifications':   unread_notifications,
            })

        # ── Vet Dashboard ────────────────────────────
        elif user.role == 'vet':
            from appointments.models import Appointment, VetClinic

            clinics      = VetClinic.objects.filter(owner=user)
            clinic_ids   = clinics.values_list('id', flat=True)

            total_appointments     = Appointment.objects.filter(clinic_id__in=clinic_ids).count()
            pending_appointments   = Appointment.objects.filter(clinic_id__in=clinic_ids, status='pending').count()
            confirmed_appointments = Appointment.objects.filter(clinic_id__in=clinic_ids, status='confirmed').count()
            done_appointments      = Appointment.objects.filter(clinic_id__in=clinic_ids, status='done').count()

            # Today's appointments
            today      = timezone.now().date()
            today_appointments = Appointment.objects.filter(
                clinic_id__in=clinic_ids,
                date_time__date=today
            ).count()

            return Response({
                'role':                    'vet',
                'clinics_count':           clinics.count(),
                'total_appointments':      total_appointments,
                'pending_appointments':    pending_appointments,
                'confirmed_appointments':  confirmed_appointments,
                'done_appointments':       done_appointments,
                'today_appointments':      today_appointments,
            })

        # ── Shelter Dashboard ────────────────────────
        elif user.role == 'shelter':
            from adoption.models import AdoptionListing, AdoptionRequest

            total_listings     = AdoptionListing.objects.filter(shelter=user).count()
            available_listings = AdoptionListing.objects.filter(shelter=user, status='available').count()
            adopted_listings   = AdoptionListing.objects.filter(shelter=user, status='adopted').count()
            pending_requests   = AdoptionRequest.objects.filter(
                listing__shelter=user,
                status='pending'
            ).count()

            return Response({
                'role':               'shelter',
                'total_listings':     total_listings,
                'available_listings': available_listings,
                'adopted_listings':   adopted_listings,
                'pending_requests':   pending_requests,
            })

        # ── Store Dashboard ──────────────────────────
        elif user.role == 'store':
            from community.models import Post

            posts_count = Post.objects.filter(author=user).count()

            return Response({
                'role':         'store',
                'posts_count':  posts_count,
            })

        return Response({'role': user.role, 'message': 'Dashboard ready'})


class DashboardChartsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # ── Owner Charts ─────────────────────────────
        if user.role == 'owner':
            from appointments.models import Appointment

            # Appointments by status
            statuses = ['pending', 'confirmed', 'done', 'cancelled']
            appointments_by_status = [
                {
                    'status': s,
                    'count':  Appointment.objects.filter(pet__owner=user, status=s).count()
                }
                for s in statuses
            ]

            # Pets by species
            from pets.models import Pet
            from django.db.models import Count
            pets_by_species = list(
                Pet.objects.filter(owner=user, is_active=True)
                .values('species')
                .annotate(count=Count('id'))
            )

            return Response({
                'appointments_by_status': appointments_by_status,
                'pets_by_species':        pets_by_species,
            })

        # ── Vet Charts ───────────────────────────────
        elif user.role == 'vet':
            from appointments.models import Appointment, VetClinic
            from django.db.models import Count

            clinic_ids = VetClinic.objects.filter(
                owner=user
            ).values_list('id', flat=True)

            # Appointments by status
            statuses = ['pending', 'confirmed', 'done', 'cancelled']
            appointments_by_status = [
                {
                    'status': s,
                    'count':  Appointment.objects.filter(clinic_id__in=clinic_ids, status=s).count()
                }
                for s in statuses
            ]

            # Appointments per clinic
            appointments_per_clinic = list(
                Appointment.objects.filter(clinic_id__in=clinic_ids)
                .values('clinic__name')
                .annotate(count=Count('id'))
            )

            return Response({
                'appointments_by_status':   appointments_by_status,
                'appointments_per_clinic':  appointments_per_clinic,
            })

        # ── Shelter Charts ───────────────────────────
        elif user.role == 'shelter':
            from adoption.models import AdoptionListing
            from django.db.models import Count

            # Listings by species
            listings_by_species = list(
                AdoptionListing.objects.filter(shelter=user)
                .values('species')
                .annotate(count=Count('id'))
            )

            # Listings by status
            listings_by_status = list(
                AdoptionListing.objects.filter(shelter=user)
                .values('status')
                .annotate(count=Count('id'))
            )

            return Response({
                'listings_by_species': listings_by_species,
                'listings_by_status':  listings_by_status,
            })

        return Response({'message': 'No charts available'})


class RecentActivityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == 'owner':
            from appointments.models import Appointment
            from notifications.models import Notification

            # Last 5 appointments
            recent_appointments = list(
                Appointment.objects.filter(pet__owner=user)
                .order_by('-created_at')[:5]
                .values('id', 'pet__name', 'clinic__name', 'status', 'date_time')
            )

            # Last 5 notifications
            recent_notifications = list(
                Notification.objects.filter(recipient=user)
                .order_by('-created_at')[:5]
                .values('id', 'title', 'type', 'is_read', 'created_at')
            )

            return Response({
                'recent_appointments':  recent_appointments,
                'recent_notifications': recent_notifications,
            })

        elif user.role == 'vet':
            from appointments.models import Appointment, VetClinic

            clinic_ids = VetClinic.objects.filter(
                owner=user
            ).values_list('id', flat=True)

            recent_appointments = list(
                Appointment.objects.filter(clinic_id__in=clinic_ids)
                .order_by('-created_at')[:10]
                .values('id', 'pet__name', 'clinic__name', 'status', 'date_time')
            )

            return Response({
                'recent_appointments': recent_appointments,
            })

        elif user.role == 'shelter':
            from adoption.models import AdoptionRequest

            recent_requests = list(
                AdoptionRequest.objects.filter(listing__shelter=user)
                .order_by('-created_at')[:10]
                .values('id', 'requester__username', 'listing__pet_name', 'status', 'created_at')
            )

            return Response({
                'recent_requests': recent_requests,
            })

        return Response({'message': 'No recent activity'})