import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './PeersCard.css';

const PeersCard = ({ peerId, peerNumber, addresses }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Card className="peer-card">
      <CardContent className="peer-card-content">
        <Typography variant="h6" className="peer-text">
          Peer {peerNumber}: {peerId}
        </Typography>
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
      </CardContent>
    </Card>
  );
};

export default PeersCard;
