from django.urls import path

from userauths.views import MyTokenObtainPairView, RegisterView, PasswordResetEmailVerify, PasswordChangeView

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('user/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register/', RegisterView.as_view(), name='register'),
    path('user/password-reset-email/<email>/', PasswordResetEmailVerify.as_view(), name='password_reset_email_verify'),
    path('user/password-reset/', PasswordChangeView.as_view(), name='password_reset'),
]
