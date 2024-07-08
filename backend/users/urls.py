from django.urls import path
from .views import RegisterView, ChangePasswordView, CustomTokenObtainPairView, LoginView, LogoutView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
]
