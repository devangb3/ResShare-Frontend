import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import FolderOffIcon from '@mui/icons-material/FolderOff';
// import useDemoRouter from './../DefaultRouter';

export default function NoFilesFound() {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        textAlign: 'center',
      }}
    >
      <FolderOffIcon sx={{ fontSize: 80, color: 'gray', mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        No Files Found
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        It looks like there are no files available to display. Please upload some files to view them here.
      </Typography>
      {/* <Button
        variant="contained"
        color="primary"
        onClick={redirectToUpload}
        sx={{ textTransform: 'none', padding: '10px 20px' }}
      >
        Go to Upload Page
      </Button> */}
    </Container>
  );
}
