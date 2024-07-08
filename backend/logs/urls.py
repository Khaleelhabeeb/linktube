from django.urls import path
from .views import LogListCreateView, LogDetailView


urlpatterns = [
    path('logs/', LogListCreateView.as_view(), name='log-list-create'),
    path('logs/<int:pk>/', LogDetailView.as_view(), name='log-detail'),
]
