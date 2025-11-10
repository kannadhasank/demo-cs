import PropTypes from 'prop-types';
import { Snackbar, Box, IconButton } from '@mui/material';
import { Close, CheckCircle, Error, Warning, Info } from '@mui/icons-material';
import './Toast.css';

const Toast = ({ open, message, type = 'success', duration = 4000, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-icon" />;
      case 'error':
        return <Error className="toast-icon" />;
      case 'warning':
        return <Warning className="toast-icon" />;
      case 'info':
        return <Info className="toast-icon" />;
      default:
        return <CheckCircle className="toast-icon" />;
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      className="toast-snackbar"
    >
      <Box className={`toast-container ${type}`}>
        {getIcon()}
        <span className="toast-message">{message}</span>
        <IconButton
          size="small"
          aria-label="close"
          onClick={onClose}
          className="toast-close-btn"
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>
    </Snackbar>
  );
};

Toast.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

export default Toast;
