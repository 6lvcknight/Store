# Generated by Django 5.0.6 on 2024-08-23 17:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("store", "0003_coupon_notification_productfaq_review_wishlist"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="color",
            options={},
        ),
        migrations.AlterModelOptions(
            name="gallery",
            options={
                "ordering": ["date"],
                "verbose_name": "Gallery",
                "verbose_name_plural": "Galleries",
            },
        ),
        migrations.AlterModelOptions(
            name="size",
            options={},
        ),
        migrations.AlterModelOptions(
            name="specification",
            options={},
        ),
        migrations.RenameField(
            model_name="gallery",
            old_name="pid",
            new_name="gid",
        ),
        migrations.AddField(
            model_name="color",
            name="image",
            field=models.FileField(
                blank=True,
                default="images/product/color/default.jpg",
                null=True,
                upload_to="images/product/color/",
            ),
        ),
        migrations.AlterField(
            model_name="category",
            name="image",
            field=models.ImageField(
                blank=True,
                default="images/category/default.jpg",
                null=True,
                upload_to="images/category",
            ),
        ),
        migrations.AlterField(
            model_name="category",
            name="slug",
            field=models.SlugField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="gallery",
            name="image",
            field=models.FileField(
                blank=True,
                default="images/product/gallery/default.jpg",
                null=True,
                upload_to="images/product/gallery/",
            ),
        ),
        migrations.AlterField(
            model_name="product",
            name="image",
            field=models.FileField(
                blank=True,
                default="images/product/default.jpg",
                null=True,
                upload_to="images/product",
            ),
        ),
        migrations.AlterField(
            model_name="product",
            name="slug",
            field=models.SlugField(blank=True, null=True),
        ),
    ]
