import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

export default function NoPeersFound() {
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
      <ReportProblemIcon sx={{ fontSize: 80, color: 'gray', mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        No Peers Found
      </Typography>
      <Typography variant="body1" color="textSecondary">
        It looks like there are no peers in the system right now. Please check back later or refresh the page.
      </Typography>
    </Container>
  );
}
