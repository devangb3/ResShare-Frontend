import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import PeersCard from '../PeersCard/PeersCard';
import SearchBar from '../SearchBar/SearchBar';
import '../PeersCard/PeersCard.css';

const fetchPeers = async () => {
  try {
    const response = await fetch('http://localhost:5000/peers');
    if (!response.ok) {
      throw new Error(`Error fetching peers: ${response.statusText}`);
    }
    const data = await response.json();

    const allAddresses = [...data.addresses, ...data.cluster_peers_addresses];

    const peerAddressMap = {};
    data.cluster_peers.forEach((peerId) => {
      peerAddressMap[peerId] = allAddresses.filter((addr) =>
        addr.includes(peerId)
      );
    });

    return { clusterPeers: data.cluster_peers, peerAddressMap };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const PeersList = () => {
  const [peerData, setPeerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPeers, setFilteredPeers] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const getPeers = async () => {
      setLoading(true);
      try {
        const data = await fetchPeers();
        setPeerData(data);
        setFilteredPeers(data.clusterPeers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getPeers();
  }, []);

  // Handle search query change
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setDropdownVisible(true);

    if (peerData && peerData.clusterPeers) {
      const filtered = peerData.clusterPeers.filter((peerId) =>
        peerId.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPeers(filtered);
    }
  };

//   const handleFileSelect = (peer) => {
//     setSearchQuery(peer);
//     setDropdownVisible(false);
//     setFilteredPeers([peer]);
//   };

    const handleFileSelect = (peer) => {
        setSearchQuery(peer.CID); // Set only the CID (Peer ID) as the search query
        setDropdownVisible(false);
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
    return (
      <Typography align="center" variant="h6" color="textSecondary">
        No peers found.
      </Typography>
    );
  }

  return (
    <Box>
      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onFileSelect={handleFileSelect}
        filteredFiles={filteredPeers.map((peerId) => ({ CID: peerId, fileName: `Peer ${peerId}` }))}
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
        placeHolder="Search by Peer ID"
      />

      {/* Filtered Peers */}
      {filteredPeers.map((peerId, index) => (
        <PeersCard
          key={index}
          peerId={peerId}
          peerNumber={index + 1}
          addresses={peerData.peerAddressMap[peerId] || []}
        />
      ))}
    </Box>
  );
};

export default PeersList;
