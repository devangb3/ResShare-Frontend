import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const FileUploadBox = ({ height, onFilePathChange, onUploadComplete }) => {
    const [files, setFiles] = useState([]);
    const [fileNames, setFileNames] = useState([]);

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        handleFileSelection(droppedFiles);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const fileUpload = (event) => {
        const selectedFiles = Array.from(event.target.files);
        handleFileSelection(selectedFiles);
        event.target.value = null; // Reset input to allow re-selection of the same file
    };

    const handleFileSelection = (selectedFiles) => {
        const newFiles = [...files, ...selectedFiles];
        const newFileNames = [...fileNames, ...selectedFiles.map((file) => file.name)];

        setFiles(newFiles);
        setFileNames(newFileNames);

        // Notify parent about selected files
        onFilePathChange(newFiles);
    };

    const removeFile = (index) => {
        const updatedFiles = files.filter((_, fileIndex) => fileIndex !== index);
        const updatedFileNames = fileNames.filter((_, fileIndex) => fileIndex !== index);

        setFiles(updatedFiles);
        setFileNames(updatedFileNames);

        // Notify parent with updated files
        onFilePathChange(updatedFiles);
    };

    useEffect(() => {
        // Wait for parent acknowledgment to clear files
        if (files.length > 0 && typeof onUploadComplete === 'function') {
            onUploadComplete(() => {
                setFiles([]);
                setFileNames([]);
            });
        }
    }, [files, onUploadComplete]);

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
                            <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                    {name}
                                </Typography>
                                <IconButton
                                    aria-label="remove file"
                                    onClick={() => removeFile(index)}
                                    size="small"
                                >
                                    <CloseIcon />
                                </IconButton>
                            </li>
                        ))}
                    </ul>
                </Box>
            )}
        </Box>
    );
};

export default FileUploadBox;