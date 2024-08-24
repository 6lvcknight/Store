# Generated by Django 5.0.6 on 2024-08-21 06:09

import django.db.models.deletion
import shortuuid.django_fields
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("store", "0001_initial"),
        ("vendor", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name="gallery",
            name="pid",
            field=shortuuid.django_fields.ShortUUIDField(
                alphabet="abcdefghijklmnopqrstuvwxyz0123456789",
                length=20,
                max_length=27,
                prefix="GALLERY",
                unique=True,
            ),
        ),
        migrations.AlterField(
            model_name="product",
            name="pid",
            field=shortuuid.django_fields.ShortUUIDField(
                alphabet="abcdefghijklmnopqrstuvwxyz0123456789",
                length=20,
                max_length=24,
                prefix="SHOP",
                unique=True,
            ),
        ),
        migrations.CreateModel(
            name="Cart",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("qty", models.PositiveIntegerField(default=0)),
                ("date", models.DateTimeField(auto_now_add=True)),
                (
                    "price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "shipping_price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "service_fee",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "tax_fee",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "total_price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                ("country", models.CharField(blank=True, max_length=100, null=True)),
                ("size", models.CharField(blank=True, max_length=100, null=True)),
                ("color", models.CharField(blank=True, max_length=100, null=True)),
                ("cart_id", models.CharField(blank=True, max_length=1000, null=True)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="store.product"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="CartOrder",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "sub_total",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "shipping_price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "tax_fee",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "service_fee",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "total_price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "payment_status",
                    models.CharField(
                        choices=[
                            ("paid", "Paid"),
                            ("pending", "Pending"),
                            ("processing", "Processing"),
                            ("cancelled", "Cancelled"),
                        ],
                        default="pending",
                        max_length=100,
                    ),
                ),
                (
                    "order_status",
                    models.CharField(
                        choices=[
                            ("pending", "Pending"),
                            ("fulfilled", "Fulfilled"),
                            ("cancelled", "Cancelled"),
                        ],
                        default="pending",
                        max_length=100,
                    ),
                ),
                (
                    "initial_total",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "saved",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                ("full_name", models.CharField(blank=True, max_length=100, null=True)),
                ("email", models.EmailField(blank=True, max_length=254, null=True)),
                ("phone", models.CharField(blank=True, max_length=100, null=True)),
                ("address", models.TextField(blank=True, max_length=100, null=True)),
                ("city", models.CharField(blank=True, max_length=100, null=True)),
                ("state", models.CharField(blank=True, max_length=100, null=True)),
                ("country", models.CharField(blank=True, max_length=100, null=True)),
                ("zip", models.CharField(blank=True, max_length=100, null=True)),
                (
                    "oid",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet="abcdefghijklmnopqrstuvwxyz0123456789",
                        length=20,
                        max_length=25,
                        prefix="ORDER",
                        unique=True,
                    ),
                ),
                ("date", models.DateTimeField(auto_now_add=True)),
                (
                    "buyer",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                ("vendor", models.ManyToManyField(blank=True, to="vendor.vendor")),
            ],
        ),
        migrations.CreateModel(
            name="CartOrderItem",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("qty", models.PositiveIntegerField(default=0)),
                (
                    "price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "sub_total",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "shipping_price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "tax_fee",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "service_fee",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "total_price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                ("size", models.CharField(blank=True, max_length=100, null=True)),
                ("color", models.CharField(blank=True, max_length=100, null=True)),
                (
                    "initial_total",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "saved",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "oid",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet="abcdefghijklmnopqrstuvwxyz0123456789",
                        length=20,
                        max_length=25,
                        prefix="ORDER",
                        unique=True,
                    ),
                ),
                ("date", models.DateTimeField(auto_now_add=True)),
                (
                    "order",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="store.cartorder",
                    ),
                ),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="store.product"
                    ),
                ),
                (
                    "vendor",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="vendor.vendor"
                    ),
                ),
            ],
        ),
    ]
