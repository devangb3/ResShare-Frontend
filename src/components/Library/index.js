import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '../SearchBar/SearchBar';
import OutlinedCard from '../Card';
import NoFilesFound from '../NoFilesFound';
import Grid from '@mui/material/Grid2';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Library = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAllFiles = async () => {
    try {
      console.log('hiii');
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
        {console.log(files, '0000000000000000')}
        {loading ? (
          <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer - 1 })}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : filteredFiles.length > 0 ? (
          filteredFiles.map((file) => <OutlinedCard key={file.CID} fileInfo={file} />)
        ) : (
          <NoFilesFound />
        )}
      </Grid>
    </>
  );
};

export default Library;
