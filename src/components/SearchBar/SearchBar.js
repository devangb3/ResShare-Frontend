import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './SearchBar.css';

const SearchBar = ({ searchQuery, onSearchChange, onFileSelect, filteredFiles, dropdownVisible, setDropdownVisible, placeHolder }) => {
  const containerRef = useRef(null);

  // Handle click outside to close the dropdown
  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setDropdownVisible(false); // Safely close dropdown
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside); // Add event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Cleanup
    };
  }, []);

  return (
    <div className="search-bar-container" ref={containerRef}>
      <input
        type="text"
        placeholder= {placeHolder} //"Search by CID or File Name"
        value={searchQuery}
        onChange={onSearchChange}
        className="search-bar-input"
      />
      {dropdownVisible && (
        <ul className="search-dropdown">
          {filteredFiles.map((file) => (
            <li
              key={file.CID}
              onClick={() => onFileSelect(file)}
              className="search-dropdown-item"
            >
              {file.fileName} ({file.CID})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onFileSelect: PropTypes.func.isRequired,
  filteredFiles: PropTypes.array.isRequired,
  dropdownVisible: PropTypes.bool.isRequired,
  setDropdownVisible: PropTypes.func.isRequired,
  placeHolder: PropTypes.string.isRequired, 
};

export default SearchBar;
