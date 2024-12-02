import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Button, CircularProgress, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SearchBar from '../SearchBar/SearchBar';
import NoPeersFound from '../NoPeersFound/index';

const FavoritePeersList = () => {
  const [favoritePeers, setFavoritePeers] = useState({});
  const [filteredPeers, setFilteredPeers] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingPeerId, setEditingPeerId] = useState(null);
  const [newNickname, setNewNickname] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const truncateText = (text, limit) => (text.length > limit ? `${text.slice(0, limit)}...` : text);

  // Fetch favorite peers
  const fetchFavoritePeers = async () => {
    try {
      const response = await fetch('http://localhost:5000/fav_peers');
      if (!response.ok) {
        throw new Error('Failed to fetch favorite peers.');
      }
      const result = await response.json();
      if (result.status === 'success' && result.data) {
        setFavoritePeers(result.data || {});
        setFilteredPeers(result.data || {});
      } else {
        throw new Error('Invalid response structure.');
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove a favorite peer
  const handleRemoveFavorite = async (peerId) => {
    try {
      const response = await fetch(`http://localhost:5000/remove_fav_peers/${peerId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove favorite peer.');
      }
      const updatedPeers = { ...favoritePeers };
      delete updatedPeers[peerId];
      setFavoritePeers(updatedPeers);
      setFilteredPeers(updatedPeers);
      setSnackbarMessage('Removed from Favorites');
      setSnackbarOpen(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Save edited nickname
  const handleSaveNickname = async (peerId) => {
    try {
      const response = await fetch(`http://localhost:5000/rename_fav_peers/${peerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_nickname: newNickname }),
      });
      if (!response.ok) {
        throw new Error('Failed to update nickname.');
      }
      setFavoritePeers((prev) => ({
        ...prev,
        [peerId]: { ...prev[peerId], nickname: newNickname },
      }));
      setFilteredPeers((prev) => ({
        ...prev,
        [peerId]: { ...prev[peerId], nickname: newNickname },
      }));
      setEditingPeerId(null);
      setNewNickname('');
      setSnackbarMessage('Nickname updated successfully');
      setSnackbarOpen(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Handle nickname editing
  const handleEditNickname = (peerId, currentNickname) => {
    setEditingPeerId(peerId);
    setNewNickname(currentNickname);
  };

  // Filter peers based on search query
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = Object.entries(favoritePeers).reduce((acc, [peerId, { nickname, peer_name }]) => {
      if (
        peerId.toLowerCase().includes(query) ||
        (nickname && nickname.toLowerCase().includes(query)) ||
        (peer_name && peer_name.toLowerCase().includes(query))
      ) {
        acc[peerId] = { nickname, peer_name };
      }
      return acc;
    }, {});

    setFilteredPeers(filtered);
    setDropdownVisible(!!query);
  };

  // Handle Snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Handle file selection (required by SearchBar but not used in this case)
  const handleFileSelect = () => {
    setDropdownVisible(false);
  };

  useEffect(() => {
    fetchFavoritePeers();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Typography color="error" align="center">
        {errorMessage}
      </Typography>
    );
  }

  const hasNoPeers = Object.keys(filteredPeers).length === 0;

  return (
    <Box>
      {/* Search Bar */}
      <Box mb={3}>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onFileSelect={handleFileSelect}
          filteredFiles={Object.entries(filteredPeers).map(([peerId, { nickname }]) => ({
            CID: peerId,
            fileName: nickname || 'Unnamed',
          }))}
          dropdownVisible={dropdownVisible}
          setDropdownVisible={setDropdownVisible}
          placeHolder="Search by Peer ID, Nickname, or Peer Name"
        />
      </Box>

      {/* Display NoPeersFound if no peers are found */}
      {hasNoPeers ? (
        <NoPeersFound />
      ) : (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {Object.entries(filteredPeers).map(([peerId, { nickname, peer_name }]) => (
            <Card key={peerId} style={{ width: '300px' }}>
              <CardContent>
                {editingPeerId === peerId ? (
                  <Box display="flex" flexDirection="column" gap={2}>
                    <input
                      label="Edit Nickname"
                      value={newNickname}
                      onChange={(e) => setNewNickname(e.target.value)}
                      fullWidth
                    />
                    <Box display="flex" justifyContent="space-between">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={() => handleSaveNickname(peerId)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setEditingPeerId(null)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h6">{nickname || 'Unnamed'}</Typography>
                    {peer_name && (
                      <Typography variant="body2" color="textSecondary">
                        Peer Name: {peer_name}
                      </Typography>
                    )}
                    <Typography variant="body2" color="textSecondary">
                      Peer ID: {truncateText(peerId, 20)}
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditNickname(peerId, nickname)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveFavorite(peerId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default FavoritePeersList;