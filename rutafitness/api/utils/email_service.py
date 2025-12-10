from django.core.mail import send_mail
from django.conf import settings

from django.core.mail import EmailMessage

def enviar_correo(subject, body, destinatarios, reply_to=None, html_body=None):
    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=None,    # usa EMAIL_HOST_USER por defecto
        to=destinatarios,
        reply_to=reply_to
    )

    if html_body:
        email.content_subtype = "html"
        email.body = html_body

    email.send()
