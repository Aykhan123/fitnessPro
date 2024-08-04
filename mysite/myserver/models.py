from django.db import models
import datetime
from datetime import datetime
from django.utils import timezone
from django.contrib.auth.models import User
# Create your models here.

class FoodEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(default=datetime.now, blank=True)
    food_name = models.CharField(max_length=200)
    calcium = models.FloatField()
    calories = models.FloatField()
    carbohydrate = models.FloatField()
    cholesterol = models.FloatField()
    fat = models.FloatField()
    fiber = models.FloatField()
    iron = models.FloatField()
    monounsaturated_fat = models.FloatField()
    polyunsaturated_fat = models.FloatField()
    potassium = models.FloatField()
    protein = models.FloatField()
    saturated_fat = models.FloatField()
    sodium = models.FloatField()
    sugar = models.FloatField()
    vitamin_a = models.FloatField()
    vitamin_c = models.FloatField()

class DailyNutrition(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    calcium = models.FloatField(default=0)
    calories = models.FloatField(default=0)
    carbohydrate = models.FloatField(default=0)
    cholesterol = models.FloatField(default=0)
    fat = models.FloatField(default=0)
    fiber = models.FloatField(default=0)
    iron = models.FloatField(default=0)
    monounsaturated_fat = models.FloatField(default=0)
    polyunsaturated_fat = models.FloatField(default=0)
    potassium = models.FloatField(default=0)
    protein = models.FloatField(default=0)
    saturated_fat = models.FloatField(default=0)
    sodium = models.FloatField(default=0)
    sugar = models.FloatField(default=0)
    vitamin_a = models.FloatField(default=0)
    vitamin_c = models.FloatField(default=0)



    
