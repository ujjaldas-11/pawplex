from celery import shared_task


@shared_task
def send_vaccination_reminders():
    """
    Runs daily — checks pets with vaccinations due in 3 days
    Sends push notification + in-app notification to owner
    """
    from datetime import date, timedelta
    from pets.models import VaccinationRecord
    from .utils import create_notification, send_push_notification

    due_date = date.today() + timedelta(days=3)

    records = VaccinationRecord.objects.filter(
        next_due=due_date
    ).select_related('pet__owner')

    for record in records:
        owner = record.pet.owner
        title = f'💉 Vaccination Due in 3 Days'
        body  = f'{record.pet.name} needs {record.vaccine_name} on {record.next_due}'

        # In-app notification
        create_notification(
            recipient=owner,
            type='vaccination',
            title=title,
            body=body,
        )

        # Push notification
        send_push_notification(user=owner, title=title, body=body)

    return f'Sent {records.count()} vaccination reminders'


@shared_task
def send_appointment_notification(appointment_id, status):
    """
    Fires when appointment status changes
    """
    from appointments.models import Appointment
    from .utils import create_notification, send_email_notification

    try:
        appointment = Appointment.objects.get(id=appointment_id)
        owner       = appointment.pet.owner

        messages = {
            'confirmed':  f'Your appointment for {appointment.pet.name} at {appointment.clinic.name} is confirmed ✅',
            'cancelled':  f'Your appointment for {appointment.pet.name} has been cancelled ❌',
            'done':       f'Appointment for {appointment.pet.name} completed. Hope all went well! 🐾',
        }

        body = messages.get(status, f'Appointment status updated to {status}')

        # In-app notification
        create_notification(
            recipient=owner,
            type='appointment',
            title=f'Appointment {status.capitalize()}',
            body=body,
        )

        # Email notification
        send_email_notification(
            recipient_email=owner.email,
            subject=f'PawPlex — Appointment {status.capitalize()}',
            message=body,
        )

    except Appointment.DoesNotExist:
        return 'Appointment not found'

    return f'Appointment notification sent for {appointment_id}'


@shared_task
def send_adoption_notification(adoption_request_id):
    """
    Fires when someone expresses interest in adoption
    """
    from adoption.models import AdoptionRequest
    from .utils import create_notification

    try:
        req     = AdoptionRequest.objects.get(id=adoption_request_id)
        shelter = req.listing.shelter

        create_notification(
            recipient=shelter,
            type='adoption',
            title='New Adoption Request 🐾',
            body=f'{req.requester.username} is interested in adopting {req.listing.pet_name}',
        )

    except AdoptionRequest.DoesNotExist:
        return 'Adoption request not found'

    return 'Adoption notification sent'


@shared_task
def send_sos_sms(alert_id):
    from emergency.models import SOSAlert
    from .utils import send_sms_notification

    try:
        alert = SOSAlert.objects.get(id=alert_id)
        if not alert.emergency_contact:
            return 'No emergency contact'

        message = (
            f'🆘 EMERGENCY ALERT!\n'
            f'{alert.owner.username} needs urgent vet help!\n'
            f'Location: {alert.lat}, {alert.lng}\n'
            f'Address: {alert.address}'
        )
        send_sms_notification(phone=alert.emergency_contact, message=message)

    except SOSAlert.DoesNotExist:
        return 'SOS alert not found'

    return f'SOS SMS sent to {alert.emergency_contact}'