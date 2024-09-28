from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
import os 
import requests
import time
import random
import string
import hmac
import hashlib
import base64
import json
from django.http import JsonResponse
from urllib.parse import urlencode, quote
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import logout
from myserver.models import DailyNutrition, CalorieTracker, Pictures, UserHealthData
from django.utils.timezone import now
from django.contrib.auth.decorators import login_required
from django.utils.functional import SimpleLazyObject
from django.db.models import Sum
from django.utils.timezone import now


# Create your views here.

def csrftoken(request):
    return JsonResponse({'csrf': get_token(request)})

def fatsecret_request(request):
    if request.method == 'POST':
        try:
            data = request.body.decode('utf-8').strip()  # decode and strip any leading/trailing whitespace
            print(f"Data received: {data}")

            if data:  # Proceed if data is present
                api_key = os.getenv('api_key')
                shared_secret = os.getenv('shared_secret')

                if not api_key or not shared_secret:
                    raise Exception('api_key or shared_secret has not been set')

                endpoint = 'https://platform.fatsecret.com/rest/server.api'
                oauth_nonce = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
                oauth_timestamp = str(int(time.time()))

                params = {
                    'method': 'foods.search',
                    'oauth_consumer_key': api_key,
                    'oauth_nonce': oauth_nonce,
                    'oauth_signature_method': 'HMAC-SHA1',
                    'oauth_timestamp': oauth_timestamp,
                    'oauth_version': '1.0',
                    'format': 'json',
                    'search_expression': data,  # "Apple Pie" passed in here
                }

                # Step 1: Sort and encode the parameters
                sorted_params = sorted(params.items())
                encoded_params = urlencode(sorted_params, quote_via=quote)

                # Step 2: Create the base string
                base_string = f"GET&{quote(endpoint, safe='')}&{quote(encoded_params, safe='')}"

                # Step 3: Create the signing key
                signing_key = f"{shared_secret}&"

                # Step 4: Generate the OAuth signature
                oauth_signature = base64.b64encode(
                    hmac.new(signing_key.encode(), base_string.encode(), hashlib.sha1).digest()
                ).decode()

                # Add the OAuth signature to the parameters
                params['oauth_signature'] = oauth_signature

                # Step 5: Make the GET request
                response = requests.get(endpoint, params=params)
                if response.status_code == 200:
                    return JsonResponse(response.json(), status=200)
                else:
                    return JsonResponse({'error': 'Failed to fetch data from FatSecret API'}, status=response.status_code)
            else:
                return JsonResponse({'error': 'No data provided'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

def generate_oauth_signature(http_method, url, parameters, consumer_secret, token_secret=""):
    # Step 1: Sort the parameters
    sorted_params = sorted(parameters.items())
    # Step 2: Create the base string
    base_string = "&".join(["{}={}".format(quote(str(k), safe=''), quote(str(v), safe='')) for k, v in sorted_params])
    base_string = "{}&{}&{}".format(http_method.upper(), quote(url, safe=''), quote(base_string, safe=''))

    # Step 3: Create the signing key
    signing_key = "{}&{}".format(quote(consumer_secret, safe=''), quote(token_secret, safe=''))

    # Step 4: Generate the OAuth signature
    hashed = hmac.new(signing_key.encode(), base_string.encode(), hashlib.sha1)
    return base64.b64encode(hashed.digest()).decode()

def fatsecret_get(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            consumer_key = os.getenv('consumer_key')
            consumer_secret = os.getenv('consumer_secret')
            if not consumer_key or not consumer_secret:
                raise Exception('consumer_key or consumer_secret has not been set')

            oauth_nonce = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
            oauth_timestamp = str(int(time.time()))

            parameters = {
                'method': 'food.get.v2',
                'oauth_consumer_key': consumer_key,
                'oauth_nonce': oauth_nonce,
                'oauth_signature_method': 'HMAC-SHA1',
                'oauth_timestamp': oauth_timestamp,
                'oauth_version': '1.0',
                'food_id': body,
                'format': 'json'
            }

            url = 'https://platform.fatsecret.com/rest/server.api'
            oauth_signature = generate_oauth_signature('GET', url, parameters, consumer_secret)
            parameters['oauth_signature'] = oauth_signature

            response = requests.get(url, params=parameters)
            
            if response.status_code == 200:
                return JsonResponse(response.json(), safe=False)
            else:
                return JsonResponse({'error': response.status_code, 'message': response.text}, status=response.status_code)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON in request body'}, status=400)
    
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
    
@api_view(['POST'])
def log_in(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({'detail': "Not Found"}, status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({'token': token.key, 'user': serializer.data})


@api_view(['POST'])
def sign_up(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key, 'user': serializer.data})


    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed for {}".format(request.user))


# @api_view(['POST'])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# def sign_out(request):
#     try:
#         request.user.auth_token.delete()
#         return Response({"Successfully logged out"}, status=status.HTTP_200_OK)
#     except Token.DoesNotExist:
#         return Response({"Token does not exist"}, status=status.HTTP_400_BAD_REQUEST)

# @csrf_exempt
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_nutrition(request):
    if request.method == "POST":
        user = request.user

        if not user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

        data = json.loads(request.body)
        date = now().date()

        calcium = float(data.get("calcium", 0))
        calories = float(data.get("calories", 0))
        carbohydrate = float(data.get("carbohydrate", 0))
        cholesterol = float(data.get("cholesterol", 0))
        fat = float(data.get("fat", 0))
        fiber = float(data.get("fiber", 0))
        iron = float(data.get("iron", 0))
        monounsaturated_fat = float(data.get("monounsaturated_fat", 0))
        polyunsaturated_fat = float(data.get("polyunsaturated_fat", 0))
        potassium = float(data.get("potassium", 0))
        protein = float(data.get("protein", 0))
        saturated_fat = float(data.get("saturated_fat", 0))
        sodium = float(data.get("sodium", 0))
        sugar = float(data.get("sugar", 0))
        vitamin_a = float(data.get("vitamin_a", 0))
        vitamin_c = float(data.get("vitamin_c", 0))

        daily_nutrition, created = DailyNutrition.objects.get_or_create(user=user, date=date)
        daily_nutrition.calcium += calcium
        daily_nutrition.calories += calories
        daily_nutrition.carbohydrate += carbohydrate
        daily_nutrition.cholesterol += cholesterol
        daily_nutrition.fat += fat
        daily_nutrition.fiber += fiber
        daily_nutrition.iron += iron
        daily_nutrition.monounsaturated_fat += monounsaturated_fat
        daily_nutrition.polyunsaturated_fat += polyunsaturated_fat
        daily_nutrition.potassium += potassium
        daily_nutrition.protein += protein
        daily_nutrition.saturated_fat += saturated_fat
        daily_nutrition.sodium += sodium
        daily_nutrition.sugar += sugar
        daily_nutrition.vitamin_a += vitamin_a
        daily_nutrition.vitamin_c += vitamin_c
        daily_nutrition.save()

        return JsonResponse({"status": "success"})

    return JsonResponse({"status": "error", "message": "Invalid request"}, status=400)



# @csrf_exempt
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_nutrition_data(request):
    user = request.user
    date = now().date()
    
    try:
        daily_nutrition = DailyNutrition.objects.filter(user=user, date=date).aggregate(
            calcium=Sum('calcium'),
            calories=Sum('calories'),
            carbohydrate=Sum('carbohydrate'),
            cholesterol=Sum('cholesterol'),
            fat=Sum('fat'),
            fiber=Sum('fiber'),
            iron=Sum('iron'),
            monounsaturated_fat=Sum('monounsaturated_fat'),
            polyunsaturated_fat=Sum('polyunsaturated_fat'),
            potassium=Sum('potassium'),
            protein=Sum('protein'),
            saturated_fat=Sum('saturated_fat'),
            sodium=Sum('sodium'),
            sugar=Sum('sugar'),
            vitamin_a=Sum('vitamin_a'),
            vitamin_c=Sum('vitamin_c')
        )
        
        return JsonResponse(daily_nutrition)
    except DailyNutrition.DoesNotExist:
        return JsonResponse({'error': 'No data found'}, status=404)



@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def calorie_tracker(request):
    if(request.method == 'POST'):
         body = json.loads(request.body)
         user = request.user
         food_name = body.get('food_name')
         total_calories = float(body.get('total_calories'))
         date = now().date()
         
         calorie_tracker = CalorieTracker.objects.create(user=user, date=date, food_name=food_name, total_calories=total_calories )
         calorie_tracker.save()
         return JsonResponse({"status": "saved to calories_tracker"},status=200)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_calorie_tracker(request):
    user = request.user
    date = now().date()

    try:
        calories_tracker = CalorieTracker.objects.filter(user=user, date=date).values('food_name', 'total_calories')
        calories_list = list(calories_tracker)
        return JsonResponse(calories_list, safe=False)
    except CalorieTracker.DoesNotExist:
        return JsonResponse({'error': 'No data found'}, status=404)
    


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def post_image(request):
    if request.method == 'POST':
        try:
            user = request.user
            request_body = json.loads(request.body)
            file_name = request_body['pictureName']
            image_data = request_body["image"].split(',')[1]
            encoded_image = base64.decodebytes(bytes(image_data, "utf-8"))
            
            Pictures.objects.update_or_create(
                user=user,
                defaults={
                    'picture_name': file_name,
                    'image_data': encoded_image
                }
            )
            
            return HttpResponse("Image successfully posted", status=200)
        except Exception:
            return HttpResponse("Failed to post image", status=400)
    return HttpResponse("Invalid request method", status=405)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_image(request):
    try:
        user = request.user
        image = Pictures.objects.get(user=user)
        image_data = image.image_data
        image_data = base64.b64encode(image_data).decode()
        return JsonResponse({'data': image_data}, status=200)
    except Pictures.DoesNotExist:
        return JsonResponse({'error': 'No image found for this user'}, status=404)
    
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_image(request):
    try:
        user = request.user
        picture = Pictures.objects.get(user=user)
        picture.delete()
        return JsonResponse({'status': 'Picture was successfully deleted'}, status=200)
    except Pictures.DoesNotExist:
        return JsonResponse({'error': 'Picture was not found for this user'}, status=404)
    

def calculate_calories_protein(weight_lbs, height_in, gender, activity_level, target_weight_lbs, age):
    weight_kg = weight_lbs / 2.205
    height_cm = height_in * 2.54
    target_weight_kg = target_weight_lbs / 2.205
    
    if gender == 'male':
        bmr = 88.362 + (13.397 * weight_kg) + (4.799 * height_cm) - (5.677 * age)
    else:
        bmr = 447.593 + (9.247 * weight_kg) + (3.098 * height_cm) - (4.330 * age)

    activity_multiplier = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9
    }

    current_daily_calories = bmr * activity_multiplier[activity_level]

    if weight_lbs > target_weight_lbs:
        daily_calories = current_daily_calories - 500 
    elif weight_lbs < target_weight_lbs:
        daily_calories = current_daily_calories + 500 
    else:
        daily_calories = current_daily_calories
    
    protein_per_lb = 0.8
    daily_protein = protein_per_lb * weight_lbs
    # print(bmr * activity_multiplier['very_active'], daily_protein)

    return daily_calories, daily_protein, current_daily_calories


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def calculate_recommendation(request):
    if request.method == 'POST':
            data = json.loads(request.body)
            weight = float(data['weight'])
            height = float(data['height'])
            gender = data['gender']
            age = int(data['age'])
            activity_level = data['activity_level']
            target_weight = float(data['target_weight'])

            recommended_calories, recommended_protein, current_daily_calories = calculate_calories_protein(
                weight, height, gender, activity_level, target_weight, age
            )

            health_data, created = UserHealthData.objects.update_or_create(
                user=request.user,
                defaults={
                    'weight': weight,
                    'height': height,
                    'age': age,
                    'gender': gender,
                    'activity_level': activity_level,
                    'target_weight': target_weight,
                    'recommended_calories': recommended_calories,
                    'recommended_protein': recommended_protein,
                    'maintain_weight': current_daily_calories
                }
            )

            return JsonResponse({
                'recommended_calories': recommended_calories,
                'recommended_protein': recommended_protein,
                'maintain': current_daily_calories
            }, status=200)

    return JsonResponse({'error': 'error posting to db'})
    

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])   
def get_recommendation(request):
    user = request.user
    try:
        user_health_data = UserHealthData.objects.get(user=user)
    except UserHealthData.DoesNotExist:
        return JsonResponse({'error': 'User health data does not exist'}, status=404)
    
    data = {
        'weight': user_health_data.weight,
        'height': user_health_data.height,
        'gender': user_health_data.gender,
        'activity_level': user_health_data.activity_level,
        'target_weight': user_health_data.target_weight,
        'recommended_calories': user_health_data.recommended_calories,
        'recommended_protein': user_health_data.recommended_protein,
        'maintain_weight': user_health_data.maintain_weight
    }
    return JsonResponse(data, status=200)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_username(request):
    user = request.user
    return JsonResponse({"username": user.username})
