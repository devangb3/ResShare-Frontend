import React, { useEffect, useState } from 'react';
import FileUploadBox from './../UploadBox';
// import OutlinedCard from './../Card';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Divider, Typography } from '@mui/material';
import axios from 'axios';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const UploadPage = () => {

    const [providedPath, setProvidedPath] = useState('');
    const [open, setOpen] = useState(false);

    const getProvidedPath = (path) => {
        setProvidedPath(path);
    }

    const uploadFile = async() => {
        try {
            const response = await axios.post('http://localhost:5000/upload', {file_path: providedPath});      
            console.log(response, '9090909090')
            setProvidedPath('');
            setOpen(true);
          } catch (err) {
            console.error("Failed to fetch files:", err);
          }
    }

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
      ) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    };

    const action = (
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      );

    return (
        <>
            <Grid container spacing={8} sx={{ marginTop: '2vh', alignItems: 'center' }}>     
                <Grid size={7}>
                <FileUploadBox height='40vh' />
                </Grid>

                <Grid size={1}>
                    {/* <Divider orientation='vertical' sx={{border: '2px dashed #ccc'}} /> */}
                    <Box
                        sx={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            height: '40vh',  // Ensure this height matches FileUploadBox or as needed
                        }}
                    >
                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                                marginLeft: '20px',
                                // borderStyle: 'dashed',
                                // borderWidth: '1px',  // Set width to make it visible
                                // borderColor: '#ccc',
                                height: '100%',  // Full height of the Box
                            }}
                        />
                        <Typography
                            variant="body1"
                            sx={{
                                position: 'absolute',
                                backgroundColor: 'white',
                                padding: '0 8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                            }}
                        >
                            OR
                        </Typography>
                    </Box>
                </Grid>

                <Grid size={4}>
                    {/* <Box>Enter file path</Box> */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            id="outlined-basic"
                            placeholder="Enter the path for the file"
                            variant="outlined"
                            sx={{ width: '100%' }}
                            onChange={e => getProvidedPath(e.target.value)}
                            value={providedPath}
                        />
                        <Box sx={{ marginLeft: '12px' }}>
                            <Button variant="contained" sx={{ padding: '14px' }} onClick={uploadFile} disabled={!providedPath}>
                                Upload
                            </Button>
                        </Box>
                    </Box>
                </Grid>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={4000} onClose={handleClose} message="File Uploaded Succesfully" action={action}/>  
        </Grid>
      </>
    )
}

export default UploadPage;