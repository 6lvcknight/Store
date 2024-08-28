from django.shortcuts import render
from django.db import transaction

from .models import Product, Category, Cart, CartOrder, CartOrderItem, Tax
from .serializer import ProductSerializer, CategorySerializer, CartSerializer, CartOrderSerializer, CartOrderItemSerializer
from userauths.models import User

from rest_framework import generics, status
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from decimal import Decimal

# Create your views here.

class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class ProductDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        slug = self.kwargs['slug']
        return Product.objects.get(slug=slug)
    
class CartAPIView(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        payload = request.data

        try:
            product = Product.objects.get(id=payload['product_id'])
            user = User.objects.get(id=payload['user_id']) if payload['user_id'] != "undefined" else None
            tax = Tax.objects.filter(country=payload['country']).first()
            tax_rate = tax.rate / 100 if tax else 0

            with transaction.atomic():
                cart, created = Cart.objects.update_or_create(
                    cart_id=payload['cart_id'], 
                    product=product,
                    defaults={
                        'user': user,
                        'qty': payload['qty'],
                        'price': payload['price'],
                        'size': payload['size'],
                        'color': payload['color'],
                        'country': payload['country'],
                        'shipping_amount': Decimal(payload['shipping_amount']),
                        'sub_total': Decimal(payload['price']) * Decimal(payload['qty']),
                        'total_price': Decimal(payload['price']) * Decimal(payload['qty']) + Decimal(payload['shipping_amount']),
                        'tax_fee': Decimal(payload['price']) * Decimal(payload['qty']) * Decimal(tax_rate),
                        'grand_total': (Decimal(payload['price']) * Decimal(payload['qty']) + Decimal(payload['shipping_amount'])) + (Decimal(payload['price']) * Decimal(payload['qty']) * Decimal(tax_rate))
                    }
                )

                if created:
                    return Response({'message': 'Cart created successfully'}, status=status.HTTP_201_CREATED)
                else:
                    return Response({'message': 'Cart updated successfully'}, status=status.HTTP_200_OK)

        except Product.DoesNotExist:
            raise ValidationError({"product_id": "Product not found."})
        except User.DoesNotExist:
            raise ValidationError({"user_id": "User not found."})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)