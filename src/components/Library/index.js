import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '../SearchBar/SearchBar';
import OutlinedCard from '../Card';
import NoFilesFound from '../NoFilesFound';
import Grid from '@mui/material/Grid2';
import {CircularProgress, Box} from '@mui/material';

const Library = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAllFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/all_files');   
      if (response.data && response.data.data.length > 0) {
        setFiles(response.data.data);
        setFilteredFiles(response.data.data); 
      }
      setLoading(false);   
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch files:", err);
    }
  };

  const handleDelete = (cid) => {
    setFiles(files.filter(file => file.CID != cid))
    setFilteredFiles(filteredFiles.filter(file => file.CID != cid))
  }

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const matches = files.filter((file) => {
        const cid = file.CID || '';
        const fileName = file.fileName || '';
        return (
          cid.toLowerCase().includes(query.toLowerCase()) ||
          fileName.toLowerCase().includes(query.toLowerCase())
        );
      });
      setFilteredFiles(matches);
      setDropdownVisible(true);
    } else {
      setFilteredFiles(files);
      setDropdownVisible(false);
    }
  };

  const handleSelectFile = (file) => {
    setFilteredFiles([file]); 
    setDropdownVisible(false); 
    setSearchQuery(file.fileName);
  };

  useEffect(() => {
    getAllFiles();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onFileSelect={handleSelectFile}
        filteredFiles={filteredFiles}
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
        placeHolder="Search by CID or File Name"
      />
      <Grid container spacing={8}>
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file) => <OutlinedCard key={file.CID} fileInfo={file} onDelete={handleDelete}/>)
        ) : (
          <NoFilesFound />
        )}
      </Grid>
    </>
  );
};

export default Library;
