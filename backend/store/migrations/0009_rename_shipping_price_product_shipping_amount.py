# Generated by Django 5.0.6 on 2024-09-10 12:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("store", "0008_rename_shipping_price_cart_shipping_amount_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="product",
            old_name="shipping_price",
            new_name="shipping_amount",
        ),
    ]
