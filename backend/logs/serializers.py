from rest_framework import serializers
from .models import Log


class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = ['id', 'user', 'action', 'description', 'timestamp']
        read_only_fields = ['id', 'user', 'timestamp']
