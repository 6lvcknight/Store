from django.db import models
from django.utils.text import slugify

from vendor.models import Vendor
from userauths.models import User, Profile

from shortuuid.django_fields import ShortUUIDField

# Create your models here.

class Category(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='category/images/', default="category/images/default.jpg", null=True, blank=True)
    active = models.BooleanField(default=False)
    slug = models.SlugField(unique=True, editable=False)

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['title']

    def __str__(self):
        return str(self.title)
    
class Product(models.Model):

    STATUS = (
        ('draft', 'Draft'),
        ('disabled', 'Disabled'),
        ('in_review', 'In Review'),
        ('published', 'Published'),
    )

    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='product/images/', default="product/images/default.jpg", null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    old_price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    shipping_price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)

    stock_qty = models.PositiveIntegerField(default=1)
    in_stock = models.BooleanField(default=True)

    status = models.CharField(max_length=100, choices=STATUS, default='draft')
    featured = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)
    rating = models.PositiveIntegerField(default=0)

    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)

    pid = ShortUUIDField(unique=True, length=10, prefix="SHOP", alphabet="abcdefghijklmnopqrstuvwxyz0123456789") 
    slug = models.SlugField(unique=True, editable=False)
    date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.slug == '' or self.slug == None:
            self.slug = slugify(self.name)
        
        super(Vendor, self).save(*args, **kwargs)
