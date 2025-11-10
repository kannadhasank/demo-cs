import { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Toast from '@common/Toast/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: '',
    type: 'success',
  });

  const showToast = useCallback((message, type = 'success') => {
    setToast({
      open: true,
      message,
      type,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
