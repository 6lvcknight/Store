from django.urls import path

from userauths.views import MyTokenObtainPairView, RegisterView
from store.views import store_views

from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('user/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register/', RegisterView.as_view(), name='register'),
]
