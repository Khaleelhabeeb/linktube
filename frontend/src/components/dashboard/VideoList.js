import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getVideos } from '../../services/api';
import { List, ListItem, ListItemText, Typography, CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  listItem: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

function VideoList() {
  const classes = useStyles();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await getVideos();
      setVideos(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch videos');
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <List className={classes.root}>
      {videos.length === 0 ? (
        <Typography>No videos uploaded yet.</Typography>
      ) : (
        videos.map(video => (
          <ListItem 
            button 
            component={Link} 
            to={`/video/${video.id}`} 
            key={video.id}
            className={classes.listItem}
          >
            <ListItemText primary={video.title} secondary={`Uploaded on ${new Date(video.upload_date).toLocaleDateString()}`} />
          </ListItem>
        ))
      )}
    </List>
  );
}

export default VideoList;