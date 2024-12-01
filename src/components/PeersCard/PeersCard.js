import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Snackbar,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star'; // Highlighted star icon
import './PeersCard.css';

const PeersCard = ({ peerId, peerNumber, addresses, onAddFavorite, onRemoveFavorite, isFavorite }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [favoriteDialogOpen, setFavoriteDialogOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleAddFavorite = () => {
    if (!nickname.trim()) {
      alert('Nickname cannot be empty.');
      return;
    }
    onAddFavorite(peerId, nickname);
    setFavoriteDialogOpen(false);
    setNickname('');
    setSnackbarMessage('Added to Favorites');
    setSnackbarOpen(true);
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      onRemoveFavorite(peerId); // Call the remove function if it's already a favorite
      setSnackbarMessage('Removed from Favorites');
      setSnackbarOpen(true);
    } else {
      setFavoriteDialogOpen(true); // Open dialog to add as favorite
    }
  };

  return (
    <>
      <Card className="peer-card">
        <CardContent className="peer-card-content">
          <Typography variant="h6" className="peer-text">
            Peer {peerNumber}: {peerId}
          </Typography>
          <div>
            <IconButton
              onClick={handleToggleFavorite}
              className={isFavorite ? 'highlighted-star' : ''}
            >
              {isFavorite ? <StarIcon style={{ fill: "gold" }} /> : <StarBorderIcon />}
            </IconButton>
            <IconButton
              aria-controls={open ? 'peer-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              size="small"
              className="peer-button"
            >
              <MoreVertIcon />
            </IconButton>
          </div>
          <Menu
            id="peer-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'peer-menu-button',
            }}
          >
            {addresses.map((address, index) => (
              <MenuItem key={index} onClick={handleClose}>
                {address}
              </MenuItem>
            ))}
          </Menu>
          <Dialog open={favoriteDialogOpen} onClose={() => setFavoriteDialogOpen(false)}>
            <DialogTitle>Add to Favorites</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Nickname"
                fullWidth
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setFavoriteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddFavorite} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message={snackbarMessage}
      />
    </>
  );
};

export default PeersCard;