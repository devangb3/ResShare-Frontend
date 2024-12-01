import React, { useState } from 'react';
import FileUploadBox from './../UploadBox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Divider, Typography, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const UploadPage = () => {
    const [providedPath, setProvidedPath] = useState('');
    const [files, setFiles] = useState([]);
    const [open, setOpen] = useState(false);

    const handleFilePathChange = (fileList) => {
        setFiles(fileList); // Store File objects
    };

    const getProvidedPath = (path) => {
        setProvidedPath(path);
    };

    const uploadFile = async () => {
        try {
            if (files.length > 0) {
                // File Blob Upload
                const formData = new FormData();
                files.forEach((file) => {
                    formData.append("files", file);
                });

                const response = await axios.post('http://localhost:5000/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log(response.data);
            } else if (providedPath) {
                // File Path Upload
                const response = await axios.post('http://localhost:5000/upload', { file_path: providedPath });
                console.log(response.data);
            }

            setOpen(true);
            setProvidedPath('');
            setFiles([]);
        } catch (err) {
            console.error('Upload failed:', err);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <>
            <Grid container spacing={4} sx={{ marginTop: '2vh', alignItems: 'center' }}>
                {/* Upload Box Section */}
                <Grid item xs={6}>
                    <FileUploadBox height="40vh" onFilePathChange={handleFilePathChange} />
                </Grid>

                {/* Divider with OR */}
                <Grid item xs={1}>
                    <Box
                        sx={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            height: '40vh',
                        }}
                    >
                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                                marginLeft: '20px',
                                height: '100%',
                            }}
                        />
                        <Typography
                            variant="body1"
                            sx={(theme) => (  theme === "dark" ? {
                                position: 'absolute',
                                backgroundColor: 'white',
                                padding: '0 8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                            } : {
                                position: 'absolute',
                                backgroundColor: 'dark',
                                padding: '0 8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                            })}

                        >
                            OR
                        </Typography>
                    </Box>
                </Grid>

                {/* File Path Section */}
                <Grid item xs={5}>
                    <TextField
                        id="outlined-basic"
                        placeholder="Enter the path for the file"
                        variant="outlined"
                        sx={{ width: '100%' }}
                        onChange={(e) => getProvidedPath(e.target.value)}
                        value={providedPath}
                    />
                </Grid>

                {/* Common Upload Button */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ padding: '14px 24px' }}
                            onClick={uploadFile}
                            disabled={!providedPath && files.length === 0}
                        >
                            Upload
                        </Button>
                    </Box>
                </Grid>

                <Snackbar
                    open={open}
                    autoHideDuration={4000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    message="File Uploaded Successfully"
                    action={action}
                />
            </Grid>
        </>
    );
};

export default UploadPage;