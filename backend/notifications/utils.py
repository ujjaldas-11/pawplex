from .models import Notification


def create_notification(recipient, type, title, body):
    """
    Creates an in-app notification for a user
    """
    return Notification.objects.create(
        recipient=recipient,
        type=type,
        title=title,
        body=body,
    )


def send_push_notification(user, title, body):
    """
    Sends Firebase FCM push notification
    Gracefully skips if FCM not configured
    """
    from django.conf import settings

    if not settings.FCM_SERVER_KEY:
        print(f'[FCM SKIP] {title} → {user.username}')
        return

    try:
        from pyfcm import FCMNotification
        push_service = FCMNotification(api_key=settings.FCM_SERVER_KEY)
        # In real app, store FCM token on user model
        # For now just log it
        print(f'[FCM] Sending to {user.username}: {title}')
    except Exception as e:
        print(f'[FCM ERROR] {str(e)}')


def send_email_notification(recipient_email, subject, message):
    """
    Sends email notification
    Gracefully skips if email not configured
    """
    from django.conf import settings
    from django.core.mail import send_mail

    if not settings.EMAIL_HOST_USER:
        print(f'[EMAIL SKIP] {subject} → {recipient_email}')
        return

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[recipient_email],
            fail_silently=True,
        )
        print(f'[EMAIL] Sent to {recipient_email}: {subject}')
    except Exception as e:
        print(f'[EMAIL ERROR] {str(e)}')