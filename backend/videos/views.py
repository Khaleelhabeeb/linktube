from rest_framework import generics, permissions
from .models import Video
from .serializers import VideoSerializer
from logs.models import Log


class VideoListCreateView(generics.ListCreateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        video = serializer.save(user=self.request.user)
        Log.objects.create(
            user=self.request.user,
            action='Video Upload',
            description=f'User {self.request.user.username} uploaded video {video.title}.'
        )


class VideoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
