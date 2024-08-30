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
        

class CartListView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Cart.objects.all()

    def get_queryset(self):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id')
        
        if user_id is not None:
            user = User.objects.get
            queryset = Cart.objects.filter(cart_id=cart_id, user=user_id)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)

        return queryset
    
class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'cart_id'

    def get_queryset(self):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id')
        
        if user_id is not None:
            user = User.objects.get
            queryset = Cart.objects.filter(cart_id=cart_id, user=user_id)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)

        return queryset
    
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        total_shipping = 0
        total_sub_total = 0
        total_tax = 0
        total_grand_total = 0

        for cart_item in queryset:
            total_shipping += cart_item.shipping_amount
            total_sub_total += cart_item.sub_total
            total_tax += cart_item.tax_fee
            total_grand_total += cart_item.grand_total
        
        data = {
            'shipping': total_shipping,
            'sub_total': total_sub_total,
            'tax_fee': total_tax,
            'grand_total': total_grand_total,
        }
        return Response(data, status=status.HTTP_200_OK)
