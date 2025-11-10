import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const EndItemContext = createContext();

export const useEndItem = () => {
  const context = useContext(EndItemContext);
  if (!context) {
    throw new Error('useEndItem must be used within an EndItemProvider');
  }
  return context;
};

export const EndItemProvider = ({ children }) => {
  const [selectedEndItem, setSelectedEndItem] = useState(null);
  const [endItems, setEndItems] = useState([]);

  const selectEndItem = (endItem) => {
    setSelectedEndItem(endItem);
  };

  const updateEndItems = (items) => {
    setEndItems(items);

    // If no items exist, clear selection
    if (!items || items.length === 0) {
      setSelectedEndItem(null);
      return;
    }

    // Check if selected item still exists in the updated list
    if (selectedEndItem) {
      const stillExists = items.find(item => item.id === selectedEndItem.id);
      // If selected item was deleted, clear selection
      if (!stillExists) {
        setSelectedEndItem(null);
      }
    }
  };

  const value = {
    selectedEndItem,
    endItems,
    selectEndItem,
    updateEndItems,
  };

  return <EndItemContext.Provider value={value}>{children}</EndItemContext.Provider>;
};

EndItemProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default EndItemContext;
