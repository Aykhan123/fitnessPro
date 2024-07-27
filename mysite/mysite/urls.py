"""
URL configuration for mysite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from myserver.views import csrftoken, fatsecret_request, fatsecret_get
from myserver import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('csrftoken/', csrftoken),
    path('fatsecret_request', fatsecret_request),
    path('fatsecret_get', fatsecret_get),
    re_path('log_in', views.log_in),
    re_path('sign_up', views.sign_up),
    re_path('test_token', views.test_token),
    re_path('sign_out', views.sign_out),

]

