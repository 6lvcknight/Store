from django.contrib import admin
from .models import Category, Coupon, Notification, Product, Gallery, ProductFaq, Review, Specification, Size, Color, Cart, CartOrder, CartOrderItem, Wishlist, Tax
from .forms import LocationForm

# Register your models here.
class GalleryInline(admin.TabularInline):
    model = Gallery

class SpecificationInline(admin.TabularInline):
    model = Specification

class SizeInline(admin.TabularInline):
    model = Size

class ColorInline(admin.TabularInline):
    model = Color

class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'shipping_price', 'stock_qty', 'in_stock', 'vendor', 'featured']
    search_fields = ['title', 'price', 'stock_qty', 'featured']
    list_filter = ['date']
    list_editable = ['featured']
    inlines = [GalleryInline, SpecificationInline, SizeInline, ColorInline]
    list_per_page = 10
    
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'rating', 'date']
    search_fields = ['product', 'rating']
    list_filter = ['date']
    list_per_page = 10

class ProductFaqAdmin(admin.ModelAdmin):
    list_display = ['product', 'question', 'answer', 'date']
    search_fields = ['product', 'question', 'answer']
    list_filter = ['date']
    list_per_page = 10

class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'date']
    search_fields = ['title']
    list_filter = ['date']
    list_per_page = 10

class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount', 'active', 'date']
    search_fields = ['code', 'discount', 'active']
    list_filter = ['date']
    list_editable = ['active']
    list_per_page = 10

class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'date']
    search_fields = ['user', 'product']
    list_filter = ['date']
    list_per_page = 10

class CartAdmin(admin.ModelAdmin):
    list_display = ['cart_id']

class TaxAdmin(admin.ModelAdmin):
    form = LocationForm
    list_display = ('country', 'province', 'rate', 'active', 'date')


admin.site.register(Category)
admin.site.register(Product, ProductAdmin)

admin.site.register(Cart, CartAdmin)
admin.site.register(CartOrder)
admin.site.register(CartOrderItem)

admin.site.register(Review)
admin.site.register(Tax, TaxAdmin)

