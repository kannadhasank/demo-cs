import { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import SideSheet from '@common/SideSheet/SideSheet';

const SideSheetContext = createContext();

export const useSideSheet = () => {
  const context = useContext(SideSheetContext);
  if (!context) {
    throw new Error('useSideSheet must be used within SideSheetProvider');
  }
  return context;
};

export const SideSheetProvider = ({ children }) => {
  const [sideSheet, setSideSheet] = useState({
    open: false,
    title: '',
    content: null,
    width: '400px',
  });

  const openSideSheet = useCallback((title, content, width = '400px') => {
    setSideSheet({
      open: true,
      title,
      content,
      width,
    });
  }, []);

  const closeSideSheet = useCallback(() => {
    setSideSheet((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  return (
    <SideSheetContext.Provider value={{ openSideSheet, closeSideSheet }}>
      {children}
      <SideSheet
        open={sideSheet.open}
        onClose={closeSideSheet}
        title={sideSheet.title}
        width={sideSheet.width}
      >
        {sideSheet.content}
      </SideSheet>
    </SideSheetContext.Provider>
  );
};

SideSheetProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
