from rest_framework import serializers
from .models import Video


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'user', 'title', 'description', 'file', 'upload_date', 'access_link']
        read_only_fields = ['id', 'user', 'upload_date', 'access_link']
    
    
    # disallow upload of a video larger than 10mb
    def validate_file(self, value):
        max_size = 10 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError("The maximum file size that can be uploaded is 10MB")
        return value