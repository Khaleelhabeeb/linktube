import React, { useState } from 'react';
import { uploadVideo } from '../../services/api';
import { Button, TextField, Typography, CircularProgress, makeStyles, Modal, Paper } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  fileInput: {
    display: 'none',
  },
}));

function VideoUpload() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);

    try {
      await uploadVideo(formData);
      setSuccess('Video uploaded successfully');
      setTitle('');
      setDescription('');
      setFile(null);
      handleClose();
    } catch (err) {
      setError('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Upload Video
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        className={classes.modal}
      >
        <Paper className={classes.paper}>
          <form onSubmit={handleSubmit} className={classes.form}>
            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="primary">{success}</Typography>}
            <TextField 
              label="Video Title" 
              variant="outlined"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
            <TextField 
              label="Description" 
              variant="outlined"
              multiline
              rows={4}
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
            <input
              accept="video/*"
              className={classes.fileInput}
              id="contained-button-file"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" color="default" component="span">
                Choose Video File
              </Button>
            </label>
            {file && <Typography variant="body2">{file.name}</Typography>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={uploading}
              startIcon={uploading ? <CircularProgress size={24} /> : <CloudUpload />}
            >
              {uploading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </form>
        </Paper>
      </Modal>
    </>
  );
}

export default VideoUpload;
