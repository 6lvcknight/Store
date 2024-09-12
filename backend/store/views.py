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
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        payload = request.data

        try:
            product_id = payload['product']
            user_id = payload['user']
            qty = payload['qty']
            price = payload['price']
            shipping_amount = payload['shipping_amount']
            country = payload['country']
            size = payload['size']
            color = payload['color']
            cart_id = payload['cart_id']
        
            # Fetching product, user, and tax information
            product = Product.objects.filter(status="published", id=product_id).first()
            if not product:
                return Response({"error": "Product not found"}, status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.filter(id=user_id).first() if user_id != "undefined" else None
            
            tax = Tax.objects.filter(country=country).first()
            tax_rate = tax.rate / 100 if tax else 0
        
            # Finding or creating the cart
            cart = Cart.objects.filter(cart_id=cart_id, product=product).first()

            if cart:
                # Update cart
                cart.product = product
                cart.user = user
                cart.qty = qty
                cart.price = price
                cart.sub_total = Decimal(price) * int(qty)
                cart.shipping_amount = Decimal(shipping_amount) * int(qty)
                cart.size = size
                cart.tax_fee = cart.sub_total * Decimal(tax_rate)
                cart.color = color
                cart.country = country
                cart.cart_id = cart_id
                cart.total = cart.sub_total + cart.shipping_amount + cart.tax_fee
                cart.save()
            else:
                # Create a new cart
                cart = Cart.objects.create(
                    product=product,
                    user=user,
                    qty=qty,
                    price=price,
                    sub_total=Decimal(price) * int(qty),
                    shipping_amount=Decimal(shipping_amount) * int(qty),
                    size=size,
                    tax_fee=Decimal(price) * Decimal(tax_rate),
                    color=color,
                    country=country,
                    cart_id=cart_id,
                    total=Decimal(price) * int(qty) + Decimal(shipping_amount) * int(qty) + (Decimal(price) * Decimal(tax_rate)),
                )

            return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)
        
        except KeyError as e:
            return Response({"error": f"Missing field: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        total_total = 0

        for cart_item in queryset:
            total_shipping += float(cart_item.shipping_amount)
            total_sub_total += float(cart_item.sub_total)
            total_tax += float(cart_item.tax_fee)
            total_total += float(cart_item.total)
        
        data = {
            'shipping': total_shipping,
            'sub_total': total_sub_total,
            'tax_fee': total_tax,
            'total': total_total,
        }
        return Response(data, status=status.HTTP_200_OK)

class CartItemDeleteAPIView(generics.DestroyAPIView):
    serializer_class = CartSerializer
    lookup_field = 'cart_id'

    def get_object(self):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id')
        item_id = self.kwargs['item_id']

        if user_id:
            user = User.objects.get(id=user_id)
            cart = Cart.objects.get(id=item_id, cart_id=cart_id, user=user)
        else:
            cart = Cart.objects.get(id=item_id, cart_id=cart_id)

        return cart