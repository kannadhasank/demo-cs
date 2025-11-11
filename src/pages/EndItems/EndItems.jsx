import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getEndItems, createEndItem, updateEndItem, deleteEndItem, reset } from '@store/slices/endItemSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Paper,
  Box,
  Typography
} from '@mui/material';
import { Edit, Delete, MoreVert, Add, Upload, ViewList } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import ConfirmDialog from '@common/ConfirmDialog/ConfirmDialog';
import { useToast } from '@contexts/ToastContext';
import { useSideSheet } from '@contexts/SideSheetContext';
import { useEndItem } from '@contexts/EndItemContext';
import EndItemForm from './EndItemForm';
import './EndItems.css';

const EndItems = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { endItems, isSaving, isSuccess, pagination } = useSelector((state) => state.endItem);
  const { showToast } = useToast();
  const { openSideSheet, closeSideSheet } = useSideSheet();
  const { selectEndItem, updateEndItems } = useEndItem();

  const handleSelectEndItem = (item) => {
    selectEndItem(item);
    showToast(`End item "${item.name}" selected`, 'success');
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isSideSheetOpen, setIsSideSheetOpen] = useState(false);
  const [currentEndItem, setCurrentEndItem] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    dispatch(getEndItems({ page: page + 1, perPage: rowsPerPage, search: searchTerm }));
  }, [dispatch, page, rowsPerPage, searchTerm]);

  // Update the endItems context when data changes
  useEffect(() => {
    if (endItems && endItems.length > 0) {
      updateEndItems(endItems);
    }
  }, [endItems, updateEndItems]);

  useEffect(() => {
    if (isSuccess && isSideSheetOpen) {
      closeSideSheet();
      setIsSideSheetOpen(false);
      setCurrentEndItem(null);

      // Show success toast
      if (lastAction === 'create') {
        showToast('End item created successfully', 'success');
      } else if (lastAction === 'update') {
        showToast('End item updated successfully', 'success');
      }

      setLastAction(null);
      dispatch(reset());
    }
    if (isSuccess && isDeleteDialogOpen) {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);

      // Show delete success toast
      showToast('End item deleted successfully', 'success');

      dispatch(reset());
    }
  }, [isSuccess, isSideSheetOpen, isDeleteDialogOpen, lastAction, dispatch, showToast, closeSideSheet]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columns = [
    { id: 'name', label: 'End item name' },
    { id: 'specification', label: 'Specification' },
    { id: 'issue', label: 'Issue (S1000D)' },
    { id: 'actions', label: '' }
  ];

  const handleOpenSideSheet = (endItem = null) => {
    dispatch(reset()); // Reset any previous success state
    setCurrentEndItem(endItem);
    setIsSideSheetOpen(true);

    openSideSheet(
      endItem ? 'Edit End item' : 'Add End item',
      <EndItemForm
        initialData={endItem}
        onSave={handleSaveEndItem}
        onCancel={handleCloseSideSheet}
        isLoading={isSaving}
      />,
      '400px'
    );
  };

  const handleCloseSideSheet = () => {
    closeSideSheet();
    setIsSideSheetOpen(false);
    setCurrentEndItem(null);
  };

  const handleSaveEndItem = (formData) => {
    if (currentEndItem) {
      setLastAction('update');
      dispatch(updateEndItem({ id: currentEndItem.id, data: formData }));
    } else {
      setLastAction('create');
      dispatch(createEndItem(formData));
    }
  };

  const handleOpenDeleteDialog = (item) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      dispatch(deleteEndItem(itemToDelete.id));
    }
  };

  return (
    <div className="end-items">
      {/* Header with Title and Search */}
      <div className="end-items-header">
        <h1 className="page-title">End Items</h1>

        <div className="header-actions">
          <div className="search-box">
            <SearchIcon sx={{ fontSize: 18 }} />
            <input
              type="text"
              placeholder="Search end item"
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <IconButton className="icon-button" size="small" onClick={() => handleOpenSideSheet()}>
            <Add fontSize="small" />
          </IconButton>
          <IconButton className="icon-button" size="small">
            <Upload fontSize="small" />
          </IconButton>
          <IconButton className="icon-button" size="small">
            <ViewList fontSize="small" />
          </IconButton>
        </div>
      </div>

      {/* Table */}
      <Paper className="table-card" elevation={0}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {endItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <Box className="empty-state">
                      <Typography>There are no End Items available</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                endItems.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    onDoubleClick={() => handleSelectEndItem(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.specification}</TableCell>
                    <TableCell>{item.issue}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" title="Edit" onClick={() => handleOpenSideSheet(item)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" title="Delete" onClick={() => handleOpenDeleteDialog(item)}>
                        <Delete fontSize="small" />
                      </IconButton>
                      <IconButton size="small" title="More">
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination - Outside table card */}
      {endItems.length > 0 && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50]}
          className="pagination"
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Are you sure you want to delete?"
        message={itemToDelete ? `${itemToDelete.name}` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
      />
    </div>
  );
};

export default EndItems;
