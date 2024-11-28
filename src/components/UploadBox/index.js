import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const FileUploadBox = ({ height, onFilePathChange }) => {
    const [fileNames, setFileNames] = useState([]);

    const handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        setFileNames(files.map((file) => file.name));

        // Send File objects to parent
        onFilePathChange(files);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const fileUpload = (event) => {
        const files = Array.from(event.target.files);
        setFileNames(files.map((file) => file.name));

        // Send File objects to parent
        onFilePathChange(files);
    };

    return (
        <Box
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            sx={{
                width: '100%',
                height,
                border: '2px dashed #ccc',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                alignContent: 'center',
                cursor: 'pointer',
                color: '#666',
                '&:hover': {
                    border: '2px dashed darkgrey',
                },
            }}
        >
            <Typography variant="h6" color="textSecondary">
                Drag & Drop files here or click to upload
            </Typography>
            <input
                type="file"
                multiple
                onChange={fileUpload}
                style={{ display: 'none' }}
                id="fileUploadInput"
            />
            <label htmlFor="fileUploadInput">
                <Button variant="contained" color="primary" component="span" sx={{ mt: 2 }}>
                    Choose Files
                </Button>
            </label>
            {fileNames.length > 0 && (
                <Box mt={2}>
                    <Typography variant="subtitle1">Uploaded Files:</Typography>
                    <ul>
                        {fileNames.map((name, index) => (
                            <li key={index}>{name}</li>
                        ))}
                    </ul>
                </Box>
            )}
        </Box>
    );
};

export default FileUploadBox;