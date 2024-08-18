from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from shortuuidfield import ShortUUIDField
import uuid


# Create your models here.
class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100, unique=True)
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    otp = models.CharField(max_length=100)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    # Provide custom related_name attributes to avoid conflicts
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',
        blank=True,
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        email_username = self.email.split('@')[0]
        if self.username == '' or self.username == None:
            self.username = email_username
        return super(User, self).save(*args, **kwargs)
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    image = models.FileField(upload_to='image', default='profile_pics/default.png', null=True, blank=True)
    full_name = models.CharField(max_length=100)
    about = models.TextField(max_length=500, null=True, blank=True)
    gender = models.CharField(max_length=100, null=True, blank=True)

    address = models.TextField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    zip = models.CharField(max_length=100, null=True, blank=True)

    date = models.DateTimeField(auto_now_add=True)

    pid = models.CharField(max_length=20, unique=True, editable=False)

    def __str__(self):
        if self.full_name:
            return self.full_name
        else:
            return self.user.full_name
        
    def save(self, *args, **kwargs):
        if not self.pid:
            self.pid = uuid.uuid4().hex[:20]  # Generate a unique pid
        if not self.full_name:
            self.full_name = self.user.full_name
        return super(Profile, self).save(*args, **kwargs)
    
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)