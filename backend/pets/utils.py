import qrcode
import os
from io import BytesIO
from django.core.files import File
from django.conf import settings


def generate_qr_code(pet):
    # QR contains a URL to the pet's public health card
    qr_data = f'{settings.MOBILE_URL}/pets/{pet.id}/health-card'

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)

    img = qr.make_image(fill_color='black', back_color='white')

    buffer = BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)

    filename = f'qr_pet_{pet.id}.png'
    pet.qr_code.save(filename, File(buffer), save=True)
    buffer.close()