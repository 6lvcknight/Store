from django.contrib import admin
from userauths.models import User, Profile

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'username', 'full_name', 'phone', 'is_active', 'is_staff', 'is_superuser']
    search_fields = ['email', 'username', 'full_name', 'phone']
    list_filter = ['is_active', 'is_staff', 'is_superuser']

class ProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name','gender', 'country']
    search_fields = ['full_name','gender', 'country']
    list_filter = ['date']

admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)