from math import radians, sin, cos, sqrt, atan2


def haversine(lat1, lng1, lat2, lng2):
    """
    Calculate distance between two GPS coordinates in km
    """
    R = 6371  # Earth radius in km

    dlat = radians(lat2 - lat1)
    dlng = radians(lng2 - lng1)

    a = (sin(dlat / 2) ** 2 +
         cos(radians(lat1)) * cos(radians(lat2)) *
         sin(dlng / 2) ** 2)

    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c


def get_nearest_clinics(lat, lng, limit=10):
    """
    Returns nearest open vet clinics sorted by distance
    """
    from appointments.models import VetClinic

    clinics = VetClinic.objects.filter(
        is_open=True,
        lat__isnull=False,
        lng__isnull=False
    )

    clinics_with_distance = []
    for clinic in clinics:
        distance = haversine(lat, lng, clinic.lat, clinic.lng)
        clinics_with_distance.append({
            'id':       clinic.id,
            'name':     clinic.name,
            'address':  clinic.address,
            'phone':    clinic.phone,
            'lat':      clinic.lat,
            'lng':      clinic.lng,
            'distance': round(distance, 2),
        })

    # Sort by distance
    clinics_with_distance.sort(key=lambda x: x['distance'])
    return clinics_with_distance[:limit]