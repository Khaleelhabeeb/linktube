import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/api';
import VideoList from './VideoList';
import VideoUpload from './VideoUpload';
import { Typography, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  logoutButton: {
    marginBottom: theme.spacing(2),
  },
}));

function Dashboard() {
  const classes = useStyles();
  const { user, logout: authLogout } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await logout();
      authLogout();
      history.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Dashboard
      </Typography>
      <Typography variant="subtitle1">
        Welcome, {user.username || 'User'}!
      </Typography>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleLogout}
        className={classes.logoutButton}
      >
        Logout
      </Button>
      
      <VideoUpload />
      
      <Typography variant="h5">Your Videos</Typography>
      <VideoList />
    </div>
  );
}

export default Dashboard;