from django.urls import path

from userauths.views import MyTokenObtainPairView, RegisterView, PasswordResetEmailVerify, PasswordChangeView
from store.views import CategoryListAPIView, ProductListAPIView, ProductDetailAPIView, CartAPIView

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('user/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register/', RegisterView.as_view(), name='register'),
    path('user/password-reset-email/<email>/', PasswordResetEmailVerify.as_view(), name='password_reset_email_verify'),
    path('user/password-reset/', PasswordChangeView.as_view(), name='password_reset'),

    #store endpoints
    path('store/category/', CategoryListAPIView.as_view(), name='category_list'),
    path('store/product/', ProductListAPIView.as_view(), name='product_list'),
    path('store/product-detail/<slug>', ProductDetailAPIView.as_view(), name='product_detail'),
    path('store/cart/', CartAPIView.as_view(), name='cart'),
]
