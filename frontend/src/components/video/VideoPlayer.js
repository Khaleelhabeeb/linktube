import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getVideoById } from '../../services/api';
import { Typography, CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  videoContainer: {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 aspect ratio
    height: 0,
    overflow: 'hidden',
    marginBottom: theme.spacing(2),
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  metadata: {
    marginTop: theme.spacing(2),
  },
}));

function VideoPlayer() {
  const classes = useStyles();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  const fetchVideo = useCallback(async () => {
    try {
      const response = await getVideoById(id);
      setVideo(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load video');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!video) return <Typography>Video not found</Typography>;

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>{video.title}</Typography>
      <div className={classes.videoContainer}>
        <video className={classes.video} controls>
          <source src={video.file_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className={classes.metadata}>
        <Typography variant="subtitle1">Uploaded by: {video.uploader_username}</Typography>
        <Typography variant="subtitle2">Upload date: {new Date(video.upload_date).toLocaleDateString()}</Typography>
      </div>
    </div>
  );
}

export default VideoPlayer;