from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth.password_validation import validate_password

from django.db import IntegrityError

from .models import User, Profile

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['email'] = user.email
        token['username'] = user.username
        token['full_name'] = user.full_name
        try:
            token['vendor'] = user.vendor.id
        except:
            token['vendor'] = 0

        return token
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'full_name', 'phone', 'password', 'password2')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        try:
            user = User.objects.create(
                email=validated_data['email'],
                username=validated_data['username'],
                full_name=validated_data['full_name'],
                phone=validated_data['phone']
            )

            email_username, mobile = user.email.split('@')
            user.username = email_username
            user.set_password(validated_data['password'])
            user.save()

            return user
        except IntegrityError as e:
            if 'UNIQUE constraint' in str(e):
                raise serializers.ValidationError({"email": "Email is already in use."})
            raise e
        

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representative(instance)
        response['user'] = UserSerializer(instance.user).data
        return response