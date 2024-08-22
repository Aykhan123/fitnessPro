# Generated by Django 5.0.7 on 2024-08-18 22:51

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myserver', '0009_delete_userhealthdata'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserHealthData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('weight', models.FloatField()),
                ('height', models.FloatField()),
                ('age', models.IntegerField()),
                ('gender', models.CharField(max_length=10)),
                ('activity_level', models.CharField(choices=[('sedentary', 'Sedentary (little or no exercise)'), ('light', 'Lightly active (light exercise/sports 1-3 days/week)'), ('moderate', 'Moderately active (moderate exercise/sports 3-5 days/week)'), ('active', 'Active (hard exercise/sports 6-7 days a week)'), ('very_active', 'Very active (very hard exercise/sports & a physical job)')], max_length=20)),
                ('target_weight', models.FloatField()),
                ('recommended_calories', models.FloatField(blank=True, null=True)),
                ('recommended_protein', models.FloatField(blank=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
