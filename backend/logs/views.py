from rest_framework import generics, permissions
from .models import Log
from .serializers import LogSerializer


class LogListCreateView(generics.ListCreateAPIView):
    queryset = Log.objects.all()
    serializer_class = LogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LogDetailView(generics.RetrieveAPIView):
    queryset = Log.objects.all()
    serializer_class = LogSerializer
    permission_classes = [permissions.IsAuthenticated]

