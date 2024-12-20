from django.shortcuts import render

from .models import Vendor
from .serializer import VendorSerializer

from rest_framework import generics, status, permissions
# Create your views here.

class VendorDetailsAPIView(generics.ListAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [permissions.AllowAny]