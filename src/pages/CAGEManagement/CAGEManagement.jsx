import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getCages, createCage, updateCage, deleteCage, reset } from '@store/slices/cageSlice';
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
import CageForm from './CageForm';
import './CAGEManagement.css';

const CAGEManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { cages, isSaving, isSuccess, pagination } = useSelector((state) => state.cage);
  const { showToast } = useToast();
  const { openSideSheet, closeSideSheet } = useSideSheet();

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isSideSheetOpen, setIsSideSheetOpen] = useState(false);
  const [currentCage, setCurrentCage] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    dispatch(getCages({ page: page + 1, perPage: rowsPerPage, search: searchTerm }));
  }, [dispatch, page, rowsPerPage, searchTerm]);

  useEffect(() => {
    if (isSuccess && isSideSheetOpen) {
      closeSideSheet();
      setIsSideSheetOpen(false);
      setCurrentCage(null);

      // Show success toast
      if (lastAction === 'create') {
        showToast('CAGE created successfully', 'success');
      } else if (lastAction === 'update') {
        showToast('CAGE updated successfully', 'success');
      }

      setLastAction(null);
      dispatch(reset());
    }
    if (isSuccess && isDeleteDialogOpen) {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);

      // Show delete success toast
      showToast('CAGE deleted successfully', 'success');

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
    { id: 'cageCode', label: 'CAGE Code' },
    { id: 'name', label: 'Company Name' },
    { id: 'street', label: 'Street' },
    { id: 'city', label: 'City' },
    { id: 'state', label: 'State' },
    { id: 'country', label: 'Country' },
    { id: 'postCode', label: 'Post code' },
    { id: 'actions', label: '' }
  ];

  const handleOpenSideSheet = (cage = null) => {
    dispatch(reset()); // Reset any previous success state
    setCurrentCage(cage);
    setIsSideSheetOpen(true);

    openSideSheet(
      cage ? 'Edit CAGE' : 'Add CAGE',
      <CageForm
        initialData={cage}
        onSave={handleSaveCage}
        onCancel={handleCloseSideSheet}
        isLoading={isSaving}
      />,
      '480px'
    );
  };

  const handleCloseSideSheet = () => {
    closeSideSheet();
    setIsSideSheetOpen(false);
    setCurrentCage(null);
  };

  const handleSaveCage = (formData) => {
    if (currentCage) {
      setLastAction('update');
      dispatch(updateCage({ id: currentCage.id, data: formData }));
    } else {
      setLastAction('create');
      dispatch(createCage(formData));
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
      dispatch(deleteCage(itemToDelete.id));
    }
  };

  return (
    <div className="cage-management">
      {/* Header with Title and Search */}
      <div className="cage-header">
        <h1 className="page-title">CAGE</h1>

        <div className="header-actions">
          <div className="search-box">
            <SearchIcon sx={{ fontSize: 18 }} />
            <input
              type="text"
              placeholder="Search for CAGE Code"
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
              {cages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <Box className="empty-state">
                      <Typography>There are no CAGE list available</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                cages.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.cageCode}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.street}</TableCell>
                    <TableCell>{item.city}</TableCell>
                    <TableCell>{item.state}</TableCell>
                    <TableCell>{item.country}</TableCell>
                    <TableCell>{item.postCode}</TableCell>
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
      {cages.length > 0 && (
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
        message={itemToDelete ? `${itemToDelete.cageCode}` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
      />
    </div>
  );
};

export default CAGEManagement;
