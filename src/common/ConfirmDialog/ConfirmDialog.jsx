import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton
} from '@mui/material';
import { Close, Warning } from '@mui/icons-material';
import './ConfirmDialog.css';

const ConfirmDialog = ({
  open,
  title = 'Confirm Action',
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      className="confirm-dialog"
      maxWidth="xs"
      fullWidth
    >
      <DialogContent className="confirm-dialog-content">
        <IconButton onClick={onCancel} size="small" className="close-icon">
          <Close />
        </IconButton>

        {/* <div className="icon-wrapper">
          <Warning className="warning-icon" />
        </div> */}

        <Typography className="confirm-message">
          {title} - {message}
        </Typography>
      </DialogContent>

      <DialogActions className="confirm-dialog-actions">
        <Button
          onClick={onCancel}
          variant="contained"
          className="cancel-btn"
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          className="confirm-btn"
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ConfirmDialog;
