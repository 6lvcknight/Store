# Generated by Django 5.0.6 on 2024-08-21 05:16

import django.db.models.deletion
import shortuuid.django_fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("vendor", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Category",
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
                ("title", models.CharField(max_length=100)),
                (
                    "image",
                    models.ImageField(
                        blank=True,
                        default="category/images/default.jpg",
                        null=True,
                        upload_to="category/images/",
                    ),
                ),
                ("active", models.BooleanField(default=False)),
                ("slug", models.SlugField(editable=False, unique=True)),
            ],
            options={
                "verbose_name": "Category",
                "verbose_name_plural": "Categories",
                "ordering": ["title"],
            },
        ),
        migrations.CreateModel(
            name="Product",
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
                ("title", models.CharField(max_length=100)),
                (
                    "image",
                    models.ImageField(
                        blank=True,
                        default="product/images/default.jpg",
                        null=True,
                        upload_to="product/images/",
                    ),
                ),
                ("description", models.TextField(blank=True, null=True)),
                (
                    "price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "old_price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "shipping_price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                ("stock_qty", models.PositiveIntegerField(default=1)),
                ("in_stock", models.BooleanField(default=True)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("draft", "Draft"),
                            ("disabled", "Disabled"),
                            ("in_review", "In_Review"),
                            ("published", "Published"),
                        ],
                        default="draft",
                        max_length=100,
                    ),
                ),
                ("featured", models.BooleanField(default=False)),
                ("views", models.PositiveIntegerField(default=0)),
                ("rating", models.PositiveIntegerField(default=0)),
                (
                    "pid",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet="abcdefghijklmnopqrstuvwxyz0123456789",
                        length=10,
                        max_length=14,
                        prefix="SHOP",
                        unique=True,
                    ),
                ),
                ("slug", models.SlugField(editable=False, unique=True)),
                ("date", models.DateTimeField(auto_now_add=True)),
                (
                    "category",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="store.category",
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
        migrations.CreateModel(
            name="Gallery",
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
                    "image",
                    models.ImageField(
                        blank=True,
                        default="product/gallery/default.jpg",
                        null=True,
                        upload_to="product/gallery/",
                    ),
                ),
                ("active", models.BooleanField(default=True)),
                ("date", models.DateTimeField(auto_now_add=True)),
                (
                    "pid",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet="abcdefghijklmnopqrstuvwxyz0123456789",
                        length=10,
                        max_length=17,
                        prefix="GALLERY",
                        unique=True,
                    ),
                ),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="store.product"
                    ),
                ),
            ],
            options={
                "verbose_name": "Gallery",
                "verbose_name_plural": "Galleries",
                "ordering": ["-date"],
            },
        ),
        migrations.CreateModel(
            name="Color",
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
                ("name", models.CharField(max_length=1000)),
                ("color_code", models.CharField(max_length=1000)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="store.product"
                    ),
                ),
            ],
            options={
                "verbose_name": "Color",
                "verbose_name_plural": "Colors",
            },
        ),
        migrations.CreateModel(
            name="Size",
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
                ("name", models.CharField(max_length=1000)),
                (
                    "price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                ("date", models.DateTimeField(auto_now_add=True)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="store.product"
                    ),
                ),
            ],
            options={
                "verbose_name": "Size",
                "verbose_name_plural": "Sizes",
            },
        ),
        migrations.CreateModel(
            name="Specification",
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
                ("title", models.CharField(max_length=1000)),
                ("content", models.CharField(max_length=1000)),
                ("date", models.DateTimeField(auto_now_add=True)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="store.product"
                    ),
                ),
            ],
            options={
                "verbose_name": "Specification",
                "verbose_name_plural": "Specifications",
            },
        ),
    ]
