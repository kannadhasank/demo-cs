import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import './SideSheet.css';

const SideSheet = ({ open, onClose, title, children, width = '400px' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
    } else if (isVisible) {
      // Start closing animation
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
        document.body.style.overflow = 'unset';
      }, 300); // Match animation duration

      return () => clearTimeout(timer);
    }
  }, [open, isVisible]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div className={`sidesheet-overlay ${isClosing ? 'closing' : ''}`} />
      <div className={`sidesheet ${isClosing ? 'closing' : ''}`} style={{ width }}>
        <div className="sidesheet-header">
          <h2 className="sidesheet-title">{title}</h2>
          <IconButton onClick={onClose} size="small" className="sidesheet-close">
            <Close />
          </IconButton>
        </div>
        <div className="sidesheet-content">
          {children}
        </div>
      </div>
    </>
  );
};

SideSheet.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  width: PropTypes.string,
};

export default SideSheet;
