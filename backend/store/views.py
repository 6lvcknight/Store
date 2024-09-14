from django.shortcuts import render
from django.db import transaction

from .models import Product, Category, Cart, CartOrder, CartOrderItem, Tax, Coupon
from .serializer import ProductSerializer, CategorySerializer, CartSerializer, CartOrderSerializer, CartOrderItemSerializer, CouponSerializer
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
    
class CartOrderAPIView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    queryset = CartOrder.objects.all()
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        payload = request.data

        full_name = payload['full_name']
        email = payload['email']
        phone = payload['phone']
        address = payload['address']
        apartment = payload['apartment']
        city = payload['city']
        province = payload['province']
        postal_code = payload['postal_code']
        country = payload['country']
        cart_id = payload['cart_id']
        user_id = payload['user_id']

        if user_id != 0:
            user = User.objects.get(id=user_id)
        else:
            user = None

        cart_items = Cart.objects.filter(cart_id=cart_id)

        total_shipping = Decimal(0.00)
        total_sub_total = Decimal(0.00)
        total_tax = Decimal(0.00)
        total_total = Decimal(0.00)

        order = CartOrder.objects.create(
            buyer=user,
            payment_status="processing",
            full_name=full_name,
            email=email,
            phone=phone,
            address=address,
            apartment=apartment,
            city=city,
            province=province,
            postal_code=postal_code,
            country=country,
        )

        for c in cart_items:
            CartOrderItem.objects.create(
                order=order,
                product=c.product,
                qty=c.qty,
                color=c.color,
                size=c.size,
                price=c.price,
                sub_total=c.sub_total,
                shipping_amount=c.shipping_amount,
                tax_fee=c.tax_fee,
                total=c.total,
                vendor=c.product.vendor,
            )

            total_shipping += Decimal(c.shipping_amount)
            total_sub_total += Decimal(c.sub_total)
            total_tax += Decimal(c.tax_fee)
            total_total += Decimal(c.total)

            order.vendor.add(c.product.vendor)
        
        order.shipping_amount = total_shipping
        order.sub_total = total_sub_total
        order.tax_fee = total_tax
        order.total = total_total

        order.save()

        return Response(CartOrderSerializer(order).data, status=status.HTTP_201_CREATED)
    
class CheckoutView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializer
    lookup_field = 'order_oid'

    def get_object(self):
        order_oid = self.kwargs['order_oid']
        return CartOrder.objects.get(oid=order_oid)

class CouponAPIView(generics.CreateAPIView):
    serializer_class = CouponSerializer
    queryset = Coupon.objects.all()
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        payload = request.data

        order_oid = payload['order_oid']
        coupon_code = payload['coupon_code']

        order = CartOrder.objects.get(oid=order_oid)
        coupon = Coupon.objects.get(code=coupon_code)

        if coupon:
            order_items = CartOrderItem.objects.filter(order=order)
            if order_items:
                for i in order_items:
                    if not coupon in i.coupon.all():
                        discount = i.total * coupon.discount / 100

                        i.total -= discount
                        i.sub_total -= discount
                        i.coupon.add(coupon)
                        i.saved += discount

                        order.total -= discount
                        order.sub_total -= discount
                        order.saved += discount

                        i.save()
                        order.save()

                        return Response({"message": "Coupon Activated"}, status=status.HTTP_200_OK)
                    else:
                        return Response({"message": "Coupon already used"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Order is empty"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Coupon not found"}, status=status.HTTP_200_OK)