import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const FileUploadBox = (props) => {
    const [fileNames, setFileNames] = useState([]);

    const handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        console.log(files, '000000000000000000000000000');
        
        setFileNames(files.map((file) => file.name));
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const fileUpload = (event) => {
        let fileInfo = event.target.files;
        console.log(fileInfo, '000000000000000000000000000', event.target);
        let file = Array.from(fileInfo).map((file) => file.name)
        setFileNames(file);
    }

    return (
        <Box
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            sx={{
                width: '-webkit-fill-available',
                height: props.height,
                border: '2px dashed #ccc',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                alignContent: 'center',
                cursor: 'pointer',
                color: '#666',
                // backgroundColor: '#f9f9f9',
                '&:hover': {
                    // backgroundColor: '#e9e9e9',
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
                onChange={(event) => fileUpload(event)}
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