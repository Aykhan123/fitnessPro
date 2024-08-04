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



# Create your views here.

def csrftoken(request):
    return JsonResponse({'csrf': get_token(request)})

def fatsecret_request(request):
    if request.method == 'POST':
        try:
            decoded_body = request.body.decode('utf-8')
            data = json.loads(decoded_body)
            if data:
                api_key = os.getenv('api_key')
                shared_secret =  os.getenv('shared_secret')
                if not api_key or not shared_secret:
                    raise Exception('api_key or shared_secret has not been set')
                endpoint = 'https://platform.fatsecret.com/rest/server.api'
                oauth_nonce = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
                oauth_timestamp = str(int(time.time()))
                search_expression = data

                params = {
                    'method': 'foods.search',
                    'oauth_consumer_key': api_key,
                    'oauth_nonce': oauth_nonce,
                    'oauth_signature_method': 'HMAC-SHA1',
                    'oauth_timestamp': oauth_timestamp,
                    'oauth_version': '1.0',
                    'format': 'json',
                    'search_expression': data,
                }

                base_string = f"GET&{quote(endpoint, safe='')}&{quote(urlencode(sorted(params.items())), safe='')}"
                signing_key = f"{shared_secret}&"
                oauth_signature = base64.b64encode(hmac.new(signing_key.encode(), base_string.encode(), hashlib.sha1).digest()).decode()

                params['oauth_signature'] = oauth_signature

                response = requests.get(endpoint, params=params)
                if response.status_code == 200:
                    return JsonResponse(response.json(), status=200)
                else:
                    return JsonResponse({'error': 'Failed to fetch data from FatSecret API'}, status=response.status_code)
            else:
                return JsonResponse({'error': 'No data provided'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
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

def add_food_entry(request):
    if request.method == "POST":
        food_name = request.POST["food_name"]
        calcium = float(request.POST["calcium"])
        calories = float(request.POST["calories"])
        carbohydrate = float(request.POST["carbohydrate"])
        cholesterol = float(request.POST["cholesterol"])
        fat = float(request.POST["fat"])
        fiber = float(request.POST["fiber"])
        iron = float(request.POST["iron"])
        monounsaturated_fat = float(request.POST["monounsaturated_fat"])
        polyunsaturated_fat = float(request.POST["polyunsaturated_fat"])
        potassium = float(request.POST["potassium"])
        protein = float(request.POST["protein"])
        saturated_fat = float(request.POST["saturated_fat"])
        sodium = float(request.POST["sodium"])
        sugar = float(request.POST["sugar"])
        vitamin_a = float(request.POST["vitamin_a"])
        vitamin_c = float(request.POST["vitamin_c"])

        food_entry = FoodEntry.objects.create(
            user=request.user,
            food_name=food_name,
            calcium=calcium,
            calories=calories,
            carbohydrate=carbohydrate,
            cholesterol=cholesterol,
            fat=fat,
            fiber=fiber,
            iron=iron,
            monounsaturated_fat=monounsaturated_fat,
            polyunsaturated_fat=polyunsaturated_fat,
            potassium=potassium,
            protein=protein,
            saturated_fat=saturated_fat,
            sodium=sodium,
            sugar=sugar,
            vitamin_a=vitamin_a,
            vitamin_c=vitamin_c
        )

        today = date.today()
        daily_nutrition, created = DailyNutrition.objects.get_or_create(
            user=request.user, date=today
        )
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

        return redirect("home")

    return render(request, "add_food_entry.html")