from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Log(models.Model):
    user = models.ForeignKey(User, related_name='logs', on_delete=models.CASCADE, null=True, blank=True)
    action = models.CharField(max_length=255)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.action} - {self.timestamp}'

