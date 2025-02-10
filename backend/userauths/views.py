from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, permissions

from .models import User, Profile
from .serializer import MyTokenObtainPairSerializer, RegisterSerializer, UserSerializer, ProfileSerializer

import shortuuid

# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request,*args, **kwargs):
        response = super().post(request, *args, **kwargs)

        access_token = response.data.get('access')
        refresh_token = response.data.get('refresh')

        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=True,
            samesite='None'
        )

        response.set_cookie(
            key='refresh_token',
            value= refresh_token,
            httponly=True,
            secure=True,
            samesite='None'
        )

        return response

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

class PasswordChangeView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny, )
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        payload = request.data

        otp = payload['otp']
        uidb64 = payload['uidb64']
        password = payload['password']

        print("otp ======", otp)
        print("uidb64 ======", uidb64)
        print("password ======", password)

        user = User.objects.get(id=uidb64, otp=otp)
        if user:
            user.set_password(password)
            user.otp = ''
            user.save()

            return Response({"message": "Password reset successful."}, status=200)
        else:
            return Response({"message": "Password reset failed."}, status=400)