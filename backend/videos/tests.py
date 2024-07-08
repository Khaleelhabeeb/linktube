from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from .models import Video
from logs.models import Log
import tempfile
import shutil
from unittest.mock import patch


User = get_user_model()


#overiding the file storage since the default is set to cludinary storages
@override_settings(DEFAULT_FILE_STORAGE='django.core.files.storage.FileSystemStorage')
class VideoTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='password123'
        )
        self.client.force_authenticate(user=self.user)

        self.video_data = {
            'title': 'Test Video',
            'description': 'A test video.',
            'file': SimpleUploadedFile("file.mp4", b"file_content", content_type="video/mp4")
        }

        # Mock Cloudinary uploader to avoid actual uploads
        with patch('cloudinary.uploader.upload') as mock_upload:
            mock_upload.return_value = {
                'url': 'http://mocked_url.com/file.mp4',
                'public_id': 'mocked_public_id',
                'version': 'mocked_version',
                'signature': 'mocked_signature',
                'width': 1920,
                'height': 1080,
                'format': 'mp4',
                'resource_type': 'video',
                'created_at': 'mocked_date',
                'tags': [],
                'bytes': 123456,
                'type': 'upload',
                'etag': 'mocked_etag',
                'placeholder': False,
                'url': 'http://res.cloudinary.com/demo/video/upload/v1234567890/mocked_public_id.mp4',
                'secure_url': 'https://res.cloudinary.com/demo/video/upload/v1234567890/mocked_public_id.mp4',
                'audio': {},
                'video': {},
                'is_audio': False
            }
            self.video = Video.objects.create(
                user=self.user,
                title='Existing Video',
                description='An existing video.',
                file=SimpleUploadedFile("existing_file.mp4", b"existing_file_content", content_type="video/mp4")
            )

    def tearDown(self):
        # Clean up any created temporary files
        shutil.rmtree(tempfile.gettempdir(), ignore_errors=True)

    def test_list_videos(self):
        url = reverse('video-list-create')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_video(self):
        url = reverse('video-list-create')
        with patch('cloudinary.uploader.upload') as mock_upload:
            mock_upload.return_value = {
                'url': 'http://mocked_url.com/file.mp4',
                'public_id': 'mocked_public_id',
                'version': 'mocked_version',
                'signature': 'mocked_signature',
                'width': 1920,
                'height': 1080,
                'format': 'mp4',
                'resource_type': 'video',
                'created_at': 'mocked_date',
                'tags': [],
                'bytes': 123456,
                'type': 'upload',
                'etag': 'mocked_etag',
                'placeholder': False,
                'url': 'http://res.cloudinary.com/demo/video/upload/v1234567890/mocked_public_id.mp4',
                'secure_url': 'https://res.cloudinary.com/demo/video/upload/v1234567890/mocked_public_id.mp4',
                'audio': {},
                'video': {},
                'is_audio': False
            }
            response = self.client.post(url, self.video_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Video.objects.filter(title='Test Video').exists())
        self.assertTrue(Log.objects.filter(action='Video Upload').exists())

    def test_retrieve_video(self):
        url = reverse('video-detail', args=[self.video.id])
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Existing Video')

    def test_update_video(self):
        url = reverse('video-detail', args=[self.video.id])
        data = {'title': 'Updated Video'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.video.refresh_from_db()
        self.assertEqual(self.video.title, 'Updated Video')

    def test_delete_video(self):
        url = reverse('video-detail', args=[self.video.id])
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Video.objects.filter(id=self.video.id).exists())

