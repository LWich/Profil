# Generated by Django 3.2.25 on 2024-06-04 11:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profilapp', '0002_folder_public'),
    ]

    operations = [
        migrations.AddField(
            model_name='line',
            name='showtext',
            field=models.BooleanField(default=True),
        ),
    ]
