import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Select,
  FormControl,
  CircularProgress,
  LinearProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from '@mui/material';
import {
  CloudDownload as CloudDownloadIcon,
  Upload as UploadIcon,
  ArrowForward as ArrowForwardIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useToast } from '@contexts/ToastContext';
import adonisService from '@services/adonisService';
import './S1000D.css';

const S1000D = () => {
  const { showToast } = useToast();

  // Form state
  const [targetVersion, setTargetVersion] = useState('5.0');
  const [publicationType, setPublicationType] = useState('CMM');
  const [legacyFile, setLegacyFile] = useState(null);
  const [dmrlFile, setDmrlFile] = useState(null);
  const [configFile, setConfigFile] = useState(null);
  const [isTransforming, setIsTransforming] = useState(false);

  // API state
  const [transformProgress, setTransformProgress] = useState('');
  const [transformErrors, setTransformErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [transformStatusData, setTransformStatusData] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [lastTransformParams, setLastTransformParams] = useState(null);


  // File handlers
  const handleLegacyFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLegacyFile(file);
    }
  };

  const handleDmrlFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDmrlFile(file);
    }
  };

  const handleConfigFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setConfigFile(file);
    }
  };

  const handleDownloadDmrlTemplate = () => {
    showToast('Downloading DMRL Template...', 'info');
    // TODO: Implement actual download
  };

  const handleDownloadConfigTemplate = () => {
    showToast('Downloading Configuration Template...', 'info');
    // TODO: Implement actual download
  };

  // Fetch transform status
  const fetchTransformStatus = async (params) => {
    console.log('fetchTransformStatus called with:', params);
    setIsLoadingStatus(true);
    try {
      const result = await adonisService.getSearchTransformStatus({
        actionType: 'Transform',
        profileExternalId: params.profileExternalId,
        pubtype: params.pubtype || '',
        transformationtype: params.transformationType || 'S1000D',
        userExternalID: params.userExternalId,
      });

      console.log('GetTransformStatus API result:', result);

      if (result.success && result.data) {
        setTransformStatusData(result.data);
      } else {
        showToast(result.message || 'Failed to fetch transform status', 'error');
      }
    } catch (error) {
      console.error('Fetch status error:', error);
      showToast('Failed to fetch transform status', 'error');
    } finally {
      setIsLoadingStatus(false);
    }
  };

  // Handle refresh status
  const handleRefreshStatus = () => {
    if (lastTransformParams) {
      fetchTransformStatus(lastTransformParams);
    }
  };

  // Handle file download
  const handleDownloadFile = async (filePath, fileName) => {
    showToast('Downloading file...', 'info');
    const result = await adonisService.downloadFile(filePath, fileName);
    if (result.success) {
      showToast('File downloaded successfully', 'success');
    } else {
      showToast(result.message || 'Download failed', 'error');
    }
  };

  // Get status chip color
  const getStatusColor = (status) => {
    const statusLower = typeof status === 'string' ? status.toLowerCase() : '';
    if (statusLower === 'in progress' || statusLower === 'inprogress' || status === 1) {
      return 'warning';
    } else if (statusLower === 'success' || statusLower === 'completed' || status === 2) {
      return 'success';
    } else if (statusLower === 'failed' || statusLower === 'failure' || status === 3) {
      return 'error';
    }
    return 'default';
  };

  // Get status text - return the status as-is if it's a string
  const getStatusText = (status) => {
    if (typeof status === 'string') {
      return status;
    }
    switch (status) {
      case 1:
        return 'In Progress';
      case 2:
        return 'Success';
      case 3:
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  // Reset form
  const resetForm = () => {
    setLegacyFile(null);
    setDmrlFile(null);
    setConfigFile(null);
    setTransformErrors([]);
    const legacyInput = document.getElementById('legacy-file-input');
    const dmrlInput = document.getElementById('dmrl-file-input');
    const configInput = document.getElementById('config-file-input');
    if (legacyInput) legacyInput.value = '';
    if (dmrlInput) dmrlInput.value = '';
    if (configInput) configInput.value = '';
  };

  // Main Transform Handler
  const handleTransform = async () => {
    // Validate files
    if (!legacyFile) {
      showToast('Please upload a legacy file', 'error');
      return;
    }

    if (!dmrlFile) {
      showToast('Please upload a DMRL file', 'error');
      return;
    }

    setIsTransforming(true);
    setTransformErrors([]);
    setSuccessMessage('');
    setTransformStatusData(null);

    try {
      // Call transform API with files and parameters
      const result = await adonisService.transformFiles({
        legacyFile,
        dmrlFile,
        option: 'S1000D',
        pubtype: publicationType,
        actiontype: 'Transform',
        version: targetVersion,
        onProgress: (progress) => setTransformProgress(progress),
      });

      if (!result.success) {
        throw new Error(result.message || 'Transformation failed');
      }

      // Check for errors in response
      if (result.data?.errors && result.data.errors.length > 0) {
        setTransformErrors(result.data.errors);
        showToast('Validation errors found', 'error');
        setIsTransforming(false);
        setTransformProgress('');
        return;
      }

      showToast('Transformation initiated successfully', 'success');
      setSuccessMessage('Request for Legacy manual transformation initiated. You will be notified via email once transformation is completed.');
      setIsTransforming(false);
      setTransformProgress('');

      // Get values from the result (returned by transformFiles)
      const profileExternalId = result.profileExternalId || '8da86bfe-1a34-4701-b42c-76bc057714b3';
      const userExternalId = result.userExternalId || 'c7f45eb1-af34-11f0-80ca-6045bd2c9c8b';

      // Store params for refresh
      const statusParams = {
        profileExternalId,
        userExternalId,
        pubtype: publicationType,
        transformationType: 'S1000D',
      };
      setLastTransformParams(statusParams);

      // Fetch transform status
      console.log('Calling GetTransformStatus with params:', statusParams);
      await fetchTransformStatus(statusParams);

      resetForm();

    } catch (error) {
      console.error('Transform error:', error);
      showToast('Transformation failed: ' + error.message, 'error');
      setIsTransforming(false);
      setTransformProgress('');
    }
  };

  return (
    <div className="s1000d-container">
      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {/* Transform Progress */}
      {isTransforming && transformProgress && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="info">{transformProgress}</Alert>
          <LinearProgress sx={{ mt: 1 }} />
        </Box>
      )}

      {/* DMRL Validation Errors */}
      {transformErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setTransformErrors([])}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>DMRL Validation Errors:</Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {transformErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Main Form - Horizontal Card Layout */}
      <Box className="transform-cards-container">
        {/* Card 1: Target Version & Publication Type */}
        <Paper className="transform-card">
          <Typography className="card-label">
            Target Version & Publication Type <span className="required">*</span>
          </Typography>
          <Box className="card-content">
            <FormControl size="small" className="select-control">
              <Select
                native
                value={targetVersion}
                onChange={(e) => setTargetVersion(e.target.value)}
                className="styled-select"
              >
                <option value="4.2">4.2</option>
                <option value="5.0">5.0</option>
              </Select>
            </FormControl>
            <ArrowForwardIcon className="inner-arrow" />
            <FormControl size="small" className="select-control">
              <Select
                native
                value={publicationType}
                onChange={(e) => setPublicationType(e.target.value)}
                className="styled-select"
              >
                <option value="CMM">CMM</option>
                <option value="OIM">OIM</option>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        <ArrowForwardIcon className="card-arrow" />

        {/* Card 2: Legacy File & DMRL */}
        <Paper className="transform-card">
          <Box className="card-header">
            <Typography className="card-label">
              Legacy File & DMRL <span className="required">*</span>
            </Typography>
            <Button
              variant="text"
              size="small"
              startIcon={<CloudDownloadIcon />}
              onClick={handleDownloadDmrlTemplate}
              className="download-link"
            >
              Download DMRL Template
            </Button>
          </Box>
          <Box className="card-content">
            <Box className="file-input-wrapper">
              <input
                type="file"
                id="legacy-file-input"
                accept=".pdf,.doc,.docx,.xml,.sgml"
                style={{ display: 'none' }}
                onChange={handleLegacyFileUpload}
              />
              <label htmlFor="legacy-file-input" className="file-input-label">
                <UploadIcon className="upload-icon" />
                <span>{legacyFile ? legacyFile.name : 'Legacy File (.pdf, .docx, .xml or .sgml)'}</span>
              </label>
            </Box>
            <ArrowForwardIcon className="inner-arrow" />
            <Box className="file-input-wrapper">
              <input
                type="file"
                id="dmrl-file-input"
                accept=".xlsx"
                style={{ display: 'none' }}
                onChange={handleDmrlFileUpload}
              />
              <label htmlFor="dmrl-file-input" className="file-input-label">
                <UploadIcon className="upload-icon" />
                <span>{dmrlFile ? dmrlFile.name : 'DMRL (.XLSX)'}</span>
              </label>
            </Box>
          </Box>
        </Paper>

        <ArrowForwardIcon className="card-arrow" />

        {/* Card 3: Configuration File & Transform Button */}
        <Paper className="transform-card">
          <Box className="card-header">
            <Typography className="card-label">&nbsp;</Typography>
            <Button
              variant="text"
              size="small"
              startIcon={<CloudDownloadIcon />}
              onClick={handleDownloadConfigTemplate}
              className="download-link"
            >
              Download Configuration Template
            </Button>
          </Box>
          <Box className="card-content">
            <Box className="file-input-wrapper">
              <input
                type="file"
                id="config-file-input"
                accept=".xml"
                style={{ display: 'none' }}
                onChange={handleConfigFileUpload}
              />
              <label htmlFor="config-file-input" className="file-input-label">
                <UploadIcon className="upload-icon" />
                <span>{configFile ? configFile.name : 'Configuration File (.XML)'}</span>
              </label>
            </Box>
            <ArrowForwardIcon className="inner-arrow" />
            <Button
              variant="contained"
              color="primary"
              onClick={handleTransform}
              disabled={isTransforming}
              className="transform-button"
            >
              {isTransforming ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Transforming...
                </>
              ) : (
                'Transform'
              )}
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Transform Status Table */}
      {(transformStatusData || isLoadingStatus) && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Transform Status</Typography>
            <IconButton
              onClick={handleRefreshStatus}
              disabled={isLoadingStatus}
              size="small"
              title="Refresh Status"
            >
              <RefreshIcon />
            </IconButton>
          </Box>

          {isLoadingStatus ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : transformStatusData ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell>Manual Number</TableCell>
                    <TableCell>Pub Type</TableCell>
                    <TableCell>Transform Type</TableCell>
                    <TableCell>Version</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date Processed</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(Array.isArray(transformStatusData) ? transformStatusData : [transformStatusData]).map((item, index) => (
                    <TableRow key={item.requestId || index}>
                      <TableCell>{item.fileName || '-'}</TableCell>
                      <TableCell>{item.manualNumber || '-'}</TableCell>
                      <TableCell>{item.pubType || '-'}</TableCell>
                      <TableCell>{item.transformType || '-'}</TableCell>
                      <TableCell>{item.version || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(item.status)}
                          color={getStatusColor(item.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{item.dateProcessed || '-'}</TableCell>
                      <TableCell>
                        {item.status?.toLowerCase() === 'success' || item.status?.toLowerCase() === 'completed' ? (
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleDownloadFile(
                              item.fullFileName,
                              item.fileName || 'output.zip'
                            )}
                            title="Download Output"
                          >
                            <DownloadIcon />
                          </IconButton>
                        ) : item.action || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </Paper>
      )}

    </div>
  );
};

export default S1000D;
