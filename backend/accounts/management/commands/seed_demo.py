# management/commands/seed_demo.py

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta, date


class Command(BaseCommand):
    help = 'Seeds demo data for hackathon judges'

    def handle(self, *args, **kwargs):
        self.stdout.write('🌱 Seeding PawPlex demo data...\n')

        self.create_users()
        self.create_pets()
        self.create_clinics()
        self.create_slots()
        self.create_appointments()
        self.create_adoption_listings()
        self.create_lost_found()
        self.create_community_posts()
        self.create_emergency_contacts()
        self.create_notifications()

        self.stdout.write(self.style.SUCCESS('\n✅ Demo data seeded successfully!\n'))
        self.stdout.write('👤 Login credentials:\n')
        self.stdout.write('   Owner:   alice / Test@1234\n')
        self.stdout.write('   Vet:     drsmith / Test@1234\n')
        self.stdout.write('   Shelter: happypaws / Test@1234\n')
        self.stdout.write('   Store:   petstore / Test@1234\n')
        self.stdout.write('   Admin:   admin / admin1234\n')

    def create_users(self):
        from accounts.models import User

        users = [
            {'username': 'alice',     'email': 'alice@gmail.com',     'role': 'owner',   'phone': '9876543210'},
            {'username': 'bob',       'email': 'bob@gmail.com',       'role': 'owner',   'phone': '9876543211'},
            {'username': 'drsmith',   'email': 'drsmith@gmail.com',   'role': 'vet',     'phone': '9876543212'},
            {'username': 'drpatel',   'email': 'drpatel@gmail.com',   'role': 'vet',     'phone': '9876543213'},
            {'username': 'happypaws', 'email': 'happypaws@gmail.com', 'role': 'shelter', 'phone': '9876543214'},
            {'username': 'petstore',  'email': 'petstore@gmail.com',  'role': 'store',   'phone': '9876543215'},
        ]

        for u in users:
            if not User.objects.filter(username=u['username']).exists():
                User.objects.create_user(
                    username=u['username'],
                    email=u['email'],
                    password='Test@1234',
                    role=u['role'],
                    phone=u['phone'],
                )
                self.stdout.write(f'  ✅ Created user: {u["username"]}')
            else:
                self.stdout.write(f'  ⏭️  Skipped user: {u["username"]} (already exists)')

        # Create superuser
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@pawplex.com',
                password='admin1234',
            )
            self.stdout.write('  ✅ Created superuser: admin')

    def create_pets(self):
        from accounts.models import User
        from pets.models import Pet, VaccinationRecord, MedicalRecord

        alice = User.objects.get(username='alice')
        bob   = User.objects.get(username='bob')

        pets_data = [
            {
                'owner':   alice,
                'name':    'Buddy',
                'species': 'dog',
                'breed':   'Labrador',
                'dob':     date(2021, 3, 15),
                'gender':  'male',
                'weight':  25.5,
            },
            {
                'owner':   alice,
                'name':    'Whiskers',
                'species': 'cat',
                'breed':   'Persian',
                'dob':     date(2022, 6, 10),
                'gender':  'female',
                'weight':  4.2,
            },
            {
                'owner':   bob,
                'name':    'Max',
                'species': 'dog',
                'breed':   'German Shepherd',
                'dob':     date(2020, 8, 20),
                'gender':  'male',
                'weight':  32.0,
            },
            {
                'owner':   bob,
                'name':    'Tweety',
                'species': 'bird',
                'breed':   'Canary',
                'dob':     date(2023, 1, 5),
                'gender':  'unknown',
                'weight':  0.3,
            },
        ]

        for p in pets_data:
            pet, created = Pet.objects.get_or_create(
                owner=p['owner'],
                name=p['name'],
                defaults=p
            )
            if created:
                self.stdout.write(f'  ✅ Created pet: {pet.name}')

                # Add vaccination record
                VaccinationRecord.objects.create(
                    pet=pet,
                    vaccine_name='Rabies',
                    administered=date.today() - timedelta(days=180),
                    next_due=date.today() + timedelta(days=3),
                    vet_clinic='PawClinic Central',
                )

                # Add medical record
                MedicalRecord.objects.create(
                    pet=pet,
                    title='Annual Checkup',
                    description='All vitals normal. Weight and diet on track.',
                    diagnosed=date.today() - timedelta(days=90),
                    treated_by='Dr. Smith',
                )

    def create_clinics(self):
        from accounts.models import User
        from appointments.models import VetClinic

        drsmith = User.objects.get(username='drsmith')
        drpatel = User.objects.get(username='drpatel')

        clinics = [
            {
                'owner':   drsmith,
                'name':    'PawClinic Central',
                'address': '123 Main St, Durgapur',
                'phone':   '9876543212',
                'email':   'pawclinic@gmail.com',
                'lat':     23.5204,
                'lng':     87.3119,
            },
            {
                'owner':   drpatel,
                'name':    'Happy Paws Clinic',
                'address': '456 Park Ave, Durgapur',
                'phone':   '9876543213',
                'email':   'happypawsclinic@gmail.com',
                'lat':     23.5304,
                'lng':     87.3219,
            },
        ]

        for c in clinics:
            clinic, created = VetClinic.objects.get_or_create(
                name=c['name'],
                defaults=c
            )
            if created:
                self.stdout.write(f'  ✅ Created clinic: {clinic.name}')

    def create_slots(self):
        from appointments.models import VetClinic, AvailableSlot
        from datetime import time

        for clinic in VetClinic.objects.all():
            for i in range(5):
                slot_date = date.today() + timedelta(days=i+1)
                slot, created = AvailableSlot.objects.get_or_create(
                    clinic=clinic,
                    date=slot_date,
                    start_time=time(10, 0),
                    defaults={'end_time': time(10, 30)}
                )
                if created:
                    self.stdout.write(f'  ✅ Created slot: {clinic.name} — {slot_date}')

    def create_appointments(self):
        from accounts.models import User
        from pets.models import Pet
        from appointments.models import VetClinic, Appointment

        alice  = User.objects.get(username='alice')
        buddy  = Pet.objects.get(name='Buddy', owner=alice)
        clinic = VetClinic.objects.first()

        if not Appointment.objects.filter(pet=buddy).exists():
            Appointment.objects.create(
                pet=buddy,
                clinic=clinic,
                date_time=timezone.now() + timedelta(days=2),
                reason='Annual vaccination and checkup',
                status='confirmed',
            )
            self.stdout.write(f'  ✅ Created appointment for Buddy')

    def create_adoption_listings(self):
        from accounts.models import User
        from adoption.models import AdoptionListing

        shelter = User.objects.get(username='happypaws')

        listings = [
            {
                'shelter':     shelter,
                'pet_name':    'Luna',
                'species':     'dog',
                'breed':       'Beagle',
                'age_months':  6,
                'gender':      'female',
                'description': 'Friendly and playful pup looking for a loving home 🐶',
            },
            {
                'shelter':     shelter,
                'pet_name':    'Milo',
                'species':     'cat',
                'breed':       'Tabby',
                'age_months':  12,
                'gender':      'male',
                'description': 'Calm and affectionate cat perfect for apartments 🐱',
            },
            {
                'shelter':     shelter,
                'pet_name':    'Coco',
                'species':     'rabbit',
                'breed':       'Holland Lop',
                'age_months':  4,
                'gender':      'female',
                'description': 'Adorable little bunny that loves cuddles 🐰',
            },
        ]

        for l in listings:
            listing, created = AdoptionListing.objects.get_or_create(
                shelter=l['shelter'],
                pet_name=l['pet_name'],
                defaults=l
            )
            if created:
                self.stdout.write(f'  ✅ Created adoption listing: {listing.pet_name}')

    def create_lost_found(self):
        from accounts.models import User
        from adoption.models import LostFound

        alice = User.objects.get(username='alice')

        if not LostFound.objects.filter(reporter=alice).exists():
            LostFound.objects.create(
                reporter=alice,
                type='lost',
                pet_name='Fluffy',
                species='cat',
                description='White Persian cat with blue eyes. Last seen near Central Park.',
                lat=23.5204,
                lng=87.3119,
                address='Central Park, Durgapur',
                contact='9876543210',
            )
            self.stdout.write('  ✅ Created lost pet report')

    def create_community_posts(self):
        from accounts.models import User
        from community.models import Post, Comment

        alice    = User.objects.get(username='alice')
        bob      = User.objects.get(username='bob')
        petstore = User.objects.get(username='petstore')

        posts = [
            {'author': alice,    'content': 'Buddy just learned to fetch! So proud of him 🐶❤️'},
            {'author': bob,      'content': 'Max had his checkup today. All healthy! 💪🐾'},
            {'author': petstore, 'content': 'New organic pet food just arrived at our store! 🛒🐾'},
        ]

        for p in posts:
            post, created = Post.objects.get_or_create(
                author=p['author'],
                content=p['content'],
            )
            if created:
                self.stdout.write(f'  ✅ Created post by {post.author.username}')

                # Add a comment
                Comment.objects.create(
                    post=post,
                    author=bob,
                    content='Awesome! 😍🐾'
                )

    def create_emergency_contacts(self):
        from accounts.models import User
        from emergency.models import EmergencyContact

        alice = User.objects.get(username='alice')

        if not EmergencyContact.objects.filter(user=alice).exists():
            EmergencyContact.objects.create(
                user=alice,
                name='Mom',
                phone='+919876543210',
                relation='Mother',
            )
            self.stdout.write('  ✅ Created emergency contact for alice')

    def create_notifications(self):
        from accounts.models import User
        from notifications.utils import create_notification

        alice   = User.objects.get(username='alice')
        drsmith = User.objects.get(username='drsmith')
        shelter = User.objects.get(username='happypaws')

        notifications = [
            {'recipient': alice,   'type': 'vaccination',  'title': '💉 Vaccination Due Soon',       'body': 'Buddy needs Rabies vaccine in 3 days'},
            {'recipient': alice,   'type': 'appointment',  'title': '📅 Appointment Confirmed',      'body': 'Your appointment at PawClinic Central is confirmed'},
            {'recipient': drsmith, 'type': 'appointment',  'title': '📅 New Appointment Booked',     'body': 'Alice booked an appointment for Buddy'},
            {'recipient': shelter, 'type': 'adoption',     'title': '🐾 New Adoption Request',       'body': 'Alice is interested in adopting Luna'},
            {'recipient': alice,   'type': 'general',      'title': '👋 Welcome to PawPlex!',        'body': 'Your pet care super app is ready to use'},
        ]

        for n in notifications:
            create_notification(
                recipient=n['recipient'],
                type=n['type'],
                title=n['title'],
                body=n['body'],
            )

        self.stdout.write(f'  ✅ Created {len(notifications)} notifications')