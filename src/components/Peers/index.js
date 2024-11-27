import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import PeersCard from '../PeersCard/PeersCard';
import SearchBar from '../SearchBar/SearchBar';
import NoPeersFound from '../NoPeersFound/index'; // Import the NoPeersFound component
import '../PeersCard/PeersCard.css';

const PeersList = () => {
  const [peerData, setPeerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPeers, setFilteredPeers] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [favoritePeers, setFavoritePeers] = useState({});

  useEffect(() => {
    const fetchPeersData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/peers');
        if (!response.ok) {
          throw new Error('Failed to fetch peers.');
        }
        const data = await response.json();
        const allAddresses = [...data.addresses, ...data.cluster_peers_addresses];
        const peerAddressMap = data.cluster_peers.reduce((map, peerId) => {
          map[peerId] = allAddresses.filter((addr) => addr.includes(peerId));
          return map;
        }, {});
        setPeerData({ clusterPeers: data.cluster_peers, peerAddressMap });
        setFilteredPeers(data.cluster_peers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await fetch('http://localhost:5000/fav_peers');
        if (response.ok) {
          const data = await response.json();
          setFavoritePeers(data.data || {}); // Adjust to handle the nested `data` object
        }
      } catch (err) {
        console.error('Failed to fetch favorite peers:', err);
      }
    };

    fetchPeersData();
    fetchFavorites();
  }, []);

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
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddFavorite = async (peerId, nickname) => {
    try {
      const response = await fetch('http://localhost:5000/add_fav_peers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peer_id: peerId, nickname }),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Server responded with an error:', errorResponse);
        return;
      }
      const updatedFavorites = await response.json();
      setFavoritePeers(updatedFavorites.data || {}); // Update the favorite peers list with nested `data`
    } catch (err) {
      console.error('Failed to add favorite:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        Error: {error}
      </Typography>
    );
  }

  if (!peerData || !peerData.clusterPeers || peerData.clusterPeers.length === 0) {
    return <NoPeersFound />; // Render NoPeersFound component when no peers are available
  }

  return (
    <Box>
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={(event) => {
          const query = event.target.value;
          setSearchQuery(query);
          setDropdownVisible(true);
          setFilteredPeers(
            peerData.clusterPeers.filter((peerId) =>
              peerId.toLowerCase().includes(query.toLowerCase())
            )
          );
        }}
        onFileSelect={(peer) => {
          setSearchQuery(peer.CID);
          setDropdownVisible(false);
        }}
        filteredFiles={filteredPeers.map((peerId) => ({ CID: peerId, fileName: `Peer ${peerId}` }))}
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
        placeHolder="Search by Peer ID"
      />
      {filteredPeers.length > 0 ? (
        filteredPeers.map((peerId, index) => (
          <PeersCard
            key={peerId}
            peerId={peerId}
            peerNumber={index + 1}
            addresses={peerData.peerAddressMap[peerId] || []}
            onAddFavorite={handleAddFavorite}
            onRemoveFavorite={handleRemoveFavorite}
            isFavorite={!!favoritePeers[peerId]} // Check if the peer is in the `favoritePeers` object
          />
        ))
      ) : (
        <NoPeersFound /> // Render NoPeersFound component when search results are empty
      )}
    </Box>
  );
};

export default PeersList;
