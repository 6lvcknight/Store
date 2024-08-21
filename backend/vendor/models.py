from django.db import models
from django.utils.text import slugify
from userauths.models import User

# Create your models here.

class Vendor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='vendor/images/', null=True, blank=True, default='vendor/images/default.jpg')
    name = models.CharField(max_length=100, help_text="Shop Name", null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    mobile = models.CharField(max_length=100, help_text="Shop Mobile Number", null=True, blank=True)
    active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(max_length=500, unique=True, editable=False)

    class Meta:
        verbose_name = 'Vendor'
        verbose_name_plural = 'Vendors'
        ordering = ['-date']

    def __str__(self):
        return str(self.name)
    
    def save(self, *args, **kwargs):
        if self.slug == '' or self.slug == None:
            self.slug = slugify(self.name)
        
        super(Vendor, self).save(*args, **kwargs)