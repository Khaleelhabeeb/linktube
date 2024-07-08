from django.db import models
from django.contrib.auth import get_user_model
import uuid
from cloudinary_storage.storage import VideoMediaCloudinaryStorage


User = get_user_model()


class Video(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, related_name='videos', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    file = models.FileField(upload_to='videos/', storage=VideoMediaCloudinaryStorage())
    upload_date = models.DateTimeField(auto_now_add=True)
    access_link = models.UUIDField(default=uuid.uuid4, editable=False)

    def __str__(self):
        return self.title

