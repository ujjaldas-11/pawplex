from celery import shared_task
from django.conf import settings


@shared_task
def send_emergency_sms(alert_id):
    try:
        from .models import SOSAlert
        alert = SOSAlert.objects.get(id=alert_id)

        # Skip if no emergency contact
        if not alert.emergency_contact:
            return 'No emergency contact set'

        # Skip if Twilio not configured
        if not settings.TWILIO_ACCOUNT_SID:
            return 'Twilio not configured'

        from twilio.rest import Client
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

        message = (
            f'🆘 EMERGENCY ALERT!\n'
            f'{alert.owner.username} needs urgent vet help!\n'
            f'Location: {alert.lat}, {alert.lng}\n'
            f'Address: {alert.address}\n'
            f'Time: {alert.timestamp.strftime("%Y-%m-%d %H:%M")}'
        )

        client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=alert.emergency_contact
        )

        return f'SMS sent to {alert.emergency_contact}'

    except Exception as e:
        return f'SMS failed: {str(e)}'