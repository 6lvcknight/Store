# Generated by Django 5.0.6 on 2024-09-12 05:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("store", "0013_alter_cartorder_apartment"),
    ]

    operations = [
        migrations.AlterField(
            model_name="cartorder",
            name="apartment",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
