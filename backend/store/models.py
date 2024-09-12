from django.db import models
from django.utils.text import slugify
from django.dispatch import receiver

from vendor.models import Vendor
from userauths.models import User, Profile

from shortuuid.django_fields import ShortUUIDField

# Create your models here.




class Category(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='images/category', default="images/category/default.jpg", null=True, blank=True)
    active = models.BooleanField(default=False)
    slug = models.SlugField(null=True, blank=True)

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
        ('in_review', 'In_Review'),
        ('published', 'Published'),
    )

    title = models.CharField(max_length=100)
    image = models.FileField(upload_to='images/product', default="images/product/default.jpg", null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    old_price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    shipping_amount = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)

    stock_qty = models.PositiveIntegerField(default=1)
    in_stock = models.BooleanField(default=True)

    status = models.CharField(max_length=100, choices=STATUS, default='draft')
    featured = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)
    rating = models.PositiveIntegerField(default=0)

    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)

    pid = ShortUUIDField(unique=True, length=20, prefix="SHOP", alphabet="abcdefghijklmnopqrstuvwxyz0123456789") 
    slug = models.SlugField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
    def product_rating(self):
        return Review.objects.filter(product=self).aggregate(avg_rating=models.Avg('rating'))['avg_rating']
    
    def rating_count(self):
        return Review.objects.filter(product=self).count()
    
    def gallery(self):
        return Gallery.objects.filter(product=self)
    
    def color(self):
        return Color.objects.filter(product=self)
    
    def specification(self):
        return Specification.objects.filter(product=self)
    
    def size(self):
        return Size.objects.filter(product=self)
    
    def save(self, *args, **kwargs):
        if self.slug == '' or self.slug == None:
            self.slug = slugify(self.title)
        
        super(Product, self).save(*args, **kwargs)


class Gallery(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    image = models.FileField(upload_to='images/product/gallery/', default='images/product/gallery/default.jpg', null=True, blank=True)
    active = models.BooleanField(default=True)
    date = models.DateTimeField(auto_now_add=True)
    gid = ShortUUIDField(unique=True, length=20, prefix="GALLERY", alphabet="abcdefghijklmnopqrstuvwxyz0123456789")

    class Meta:
        verbose_name = 'Gallery'
        verbose_name_plural = 'Galleries'
        ordering = ['date']

    def __str__(self):
        return "Image"
    
class Specification(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    title = models.CharField(max_length=1000)
    content = models.CharField(max_length=1000)
    date = models.DateTimeField(auto_now_add=True)
    

class Size(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    name = models.CharField(max_length=1000)
    price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    date = models.DateTimeField(auto_now_add=True)
    
class Color(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    name = models.CharField(max_length=1000)
    color_code = models.CharField(max_length=1000)
    image = models.FileField(upload_to='images/product/color/', default='images/product/color/default.jpg', null=True, blank=True)
    

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.PositiveIntegerField(default=0,null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00, null=True, blank=True)

    sub_total = models.DecimalField(decimal_places=2, max_digits=12, default=0.00, null=True, blank=True)
    shipping_amount = models.DecimalField(decimal_places=2, max_digits=12, default=0.00, null=True, blank=True)
    tax_fee = models.DecimalField(decimal_places=2, max_digits=12, default=0.00, null=True, blank=True)
    total = models.DecimalField(decimal_places=2, max_digits=12, default=0.00, null=True, blank=True)

    country = models.CharField(max_length=100, null=True, blank=True)

    size = models.CharField(max_length=100, null=True, blank=True)
    color = models.CharField(max_length=100, null=True, blank=True)
    cart_id = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self):
        return f'{self.cart_id} - {self.product.title}'
    
class CartOrder(models.Model):

    PAYMENT_STATUS = (
        ('paid', 'Paid'),
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('cancelled', 'Cancelled'),
    )

    ORDER_STATUS = (
        ('pending', 'Pending'),
        ('fulfilled', 'Fulfilled'),
        ('cancelled', 'Cancelled'),
    )

    vendor = models.ManyToManyField(Vendor, blank=True)
    buyer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)

    sub_total = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    shipping_amount = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    tax_fee = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    #service_fee = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    total_price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    grand_total = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)

    payment_status = models.CharField(choices=PAYMENT_STATUS, max_length=100, default='pending')
    order_status = models.CharField(choices=ORDER_STATUS, max_length=100, default='pending')

    # Coupons
    initial_total = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    saved = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)

    # Bio Data
    full_name = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=100, null=True, blank=True)

    # Address
    address = models.TextField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    zip = models.CharField(max_length=100, null=True, blank=True)
    
    oid = ShortUUIDField(unique=True, length=20, prefix="ORDER", alphabet="abcdefghijklmnopqrstuvwxyz0123456789")
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.oid


class CartOrderItem(models.Model):
    order = models.ForeignKey(CartOrder, on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    qty = models.PositiveIntegerField(default=0)
    price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    sub_total = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    shipping_price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    tax_fee = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    service_fee = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    total_price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)

    size = models.CharField(max_length=100, null=True, blank=True)
    color = models.CharField(max_length=100, null=True, blank=True)

    # Coupons
    initial_total = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    saved = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)

    oid = ShortUUIDField(unique=True, length=20, prefix="ORDER", alphabet="abcdefghijklmnopqrstuvwxyz0123456789")
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.oid
    
# Might/Might not be needed
class ProductFaq(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    email = models.EmailField(null=True, blank=True)
    question = models.TextField(max_length=1000)
    answer = models.TextField(null=True, blank=True)
    active = models.BooleanField(default=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question
    
    class Meta:
        verbose_name = 'Product Faq'
        verbose_name_plural = 'Product Faqs'
        ordering = ['-date']

# Might/Might not be needed
class Review(models.Model):
    RATING_CHOICES = (
        (1, '1 Star'),
        (2, '2 Star'),
        (3, '3 Star'),
        (4, '4 Star'),
        (5, '5 Star'),
    )
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    review = models.TextField(max_length=1000)
    reply = models.TextField(null=True, blank=True)
    rating = models.PositiveIntegerField(choices=RATING_CHOICES, default=None)
    active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product.title
    
    class Meta:
        verbose_name = 'Review'
        verbose_name_plural = 'Reviews'
        ordering = ['-date']

    def profile(self):
        return Profile.objects.get(user=self.user)
    
@receiver(models.signals.post_save, sender=Review)
def update_product_rating(sender, instance, **kwargs):
    if instance.product:
        instance.product.save()

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product.title
    
    class Meta:
        verbose_name = 'Wishlist'
        verbose_name_plural = 'Wishlists'
        ordering = ['-date']

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order = models.ForeignKey(CartOrder, on_delete=models.SET_NULL, null=True, blank=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    order_item = models.ForeignKey(CartOrderItem, on_delete=models.SET_NULL, null=True, blank=True)
    seen = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.order:
            return f'{self.user.email} - {self.order.oid}'
        else:
            return f'Notfication - {self.pk}'
    
    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-date']

class Coupon(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    user_by = models.ManyToManyField(User, blank=True)
    code = models.CharField(max_length=1000)
    discount = models.IntegerField(default=1)
    active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code
    
    class Meta:
        verbose_name = 'Coupon'
        verbose_name_plural = 'Coupons'

class Tax(models.Model):
    province = models.CharField(max_length=100, default='ON') 
    country = models.CharField(max_length=100, default='CA')  
    rate = models.IntegerField(default=5, help_text='In Percentage')
    active = models.BooleanField(default=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.country
    
    class Meta:
        verbose_name = 'Tax'
        verbose_name_plural = 'Taxes'
