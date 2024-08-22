from django.db import models
import datetime
from datetime import datetime
from django.utils import timezone
from django.contrib.auth.models import User
# Create your models here.


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


class CalorieTracker(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    total_calories = models.FloatField(default=0)
    food_name = models.CharField(max_length=200)

class Pictures(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    picture_name = models.CharField(max_length=200)
    image_data = models.BinaryField() 
    
    def save_image(self, image):
        self.image_data = image
        self.save()

    def read_image(self):
        return self.image_data
    
class UserHealthData(models.Model):
    ACTIVITY_LEVEL_CHOICES = [
        ('sedentary', 'Sedentary (little or no exercise)'),
        ('light', 'Lightly active (light exercise/sports 1-3 days/week)'),
        ('moderate', 'Moderately active (moderate exercise/sports 3-5 days/week)'),
        ('active', 'Active (hard exercise/sports 6-7 days a week)'),
        ('very_active', 'Very active (very hard exercise/sports & a physical job)'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    weight = models.FloatField()
    height = models.FloatField()
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    activity_level = models.CharField(max_length=20, choices=ACTIVITY_LEVEL_CHOICES)
    target_weight = models.FloatField()
    recommended_calories = models.FloatField(null=True, blank=True)
    recommended_protein = models.FloatField(null=True, blank=True)
    maintain_weight = models.FloatField(null=True, blank=True)













    
