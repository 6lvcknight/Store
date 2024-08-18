from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, permissions

from .models import User, Profile
from .serializer import MyTokenObtainPairSerializer, RegisterSerializer, UserSerializer, ProfileSerializer

import random
import shortuuid

# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny, )
    serializer_class = RegisterSerializer

def generate_otp():
    uuid = shortuuid.uuid()
    unique_key = uuid # 22 characters long
    return unique_key

class PasswordResetEmailVerify(generics.RetrieveAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny, )
    serializer_class = UserSerializer

    def get_object(self):
        email = self.kwargs.get('email')
        user = User.objects.get(email=email)

        print("User: ", user)

        if user:
            user.otp = generate_otp()
            user.save()

            uidb64 = user.pk
            otp = user.otp

            link = f"http://localhost:5173/password-reset/{otp}/{uidb64}/"

            print("Link: ", link)
        return user

class PasswordReset(generics.UpdateAPIView):
    permission_classes = (permissions.AllowAny, )
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        payload = request.data

        otp = payload['otp']
        uidb64 = payload['uidb64']
        password = payload['password']
        reset_token = payload['reset_token']

        user = User.objects.get(id=uidb64, otp=otp)
        if user:
            user.set_password(password)
            user.otp = ''
            user.reset_token = ''
            user.save()

            return Response({"message": "Password reset successful."}, status=200)
        else:
            return Response({"message": "Password reset failed."}, status=400)