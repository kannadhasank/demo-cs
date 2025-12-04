import axios from 'axios';

// ADONIS API Base URL - Uses Vite proxy in development to avoid CORS
const ADONIS_API_BASE_URL = '/api/adonis';

// Dev JWT Token - Set this or use setDevToken()
let DEV_TOKEN = 'ZlmoR2odaDKeniVQ5bhaXvNt3cpO1+WvL97S4hUMwJCJsQbrjhjBSvKTBt5r7BrfLY2xGjFIjFmaGgj3Wu/ifLf1ax9U21vdK+iE25pSkkvjRJz3dUAXTfrIbqTrTjdix9K7rScZFjCLL+kq6b9QH96cMiPTx/zBTshMyv4//rJ1pgIgxWhecdcl392zzxaEWAy2Z0Kb3vVIuHKp79HxQn1/4K/QSD8QeOKVmIq87WKrZS2YBrHf6Z52P73kChLONCWRFy2wPV7sb/3RAMWJ96SZ3AWTlrV2iOYDEsfUng49t+ZPOVCFoOrcF9YaPqE5MXUZHp5WHY+iKFU4lf4akiYiieY20bE2wmkehb7ORIiM+ez0LgN9X7ziFKv3kg/SZeCNaGibJnK+PBj6+iu5PrTJ+lJMJlV5C0vMdy8HxKrHEJRyCjHkPlq8dDaC21BE';

// Create axios instance for ADONIS APIs
const adonisApi = axios.create({
  baseURL: ADONIS_API_BASE_URL,
  timeout: 120000, // 120 seconds timeout for file uploads
});

// Add request interceptor to include Authorization header
adonisApi.interceptors.request.use(
  (config) => {
    const token = DEV_TOKEN || localStorage.getItem('adonis_dev_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Set the dev JWT token
 * @param {string} token - JWT token
 * @param {boolean} persist - Save to localStorage (default: true)
 */
const setDevToken = (token, persist = true) => {
  DEV_TOKEN = token;
  if (persist) {
    localStorage.setItem('adonis_dev_token', token);
  }
};

/**
 * Get the current token
 */
const getDevToken = () => DEV_TOKEN || localStorage.getItem('adonis_dev_token');

/**
 * Clear the token
 */
const clearDevToken = () => {
  DEV_TOKEN = '';
  localStorage.removeItem('adonis_dev_token');
};

// Store for ADONIS auth data
let adonisAuthData = null;

/**
 * Authenticate with ADONIS API
 * @param {string} userId - User email id
 * @param {string} password - Encrypted password
 * @returns {Promise<Object>} - Token, UserExternalId, ProfileExternalId
 */
const authenticate = async (userId, password) => {
  try {
    const response = await adonisApi.post('/logon/Authenticate', {
      userId,
      password,
    });

    if (response.data?.Status === 1) {
      adonisAuthData = {
        token: response.data.Token,
        userExternalId: response.data.UserExternalId,
        profileExternalId: response.data.ProfileExternalId,
      };
      return {
        success: true,
        data: adonisAuthData,
        message: response.data.Message,
      };
    } else {
      return {
        success: false,
        message: response.data?.Message || 'Authentication failed',
      };
    }
  } catch (error) {
    console.error('ADONIS Authentication Error:', error);
    return {
      success: false,
      message: error.message || 'Authentication failed',
    };
  }
};

/**
 * Upload input files (Legacy file and DMRL)
 * @param {Object} params - Upload parameters
 * @param {File} params.legacyFile - Legacy PDF/DOCX file
 * @param {File} params.dmrlFile - DMRL Excel file
 * @param {string} params.pubType - Publication type (OIM/CMM)
 * @param {string} params.transformType - Transform type (e.g., S1000D)
 * @param {string} params.version - Version (e.g., 4.2, 5.0)
 * @returns {Promise<Object>} - RequestId for transformation
 */
const uploadInputFiles = async ({
  legacyFile,
  dmrlFile,
  pubType,
  transformType,
  version,
}) => {
  if (!adonisAuthData) {
    return {
      success: false,
      message: 'Not authenticated. Please authenticate first.',
    };
  }

  try {
    const formData = new FormData();
    formData.append('LegacyFile', legacyFile);
    formData.append('DmrlFile', dmrlFile);
    formData.append('ProfileExternalId', adonisAuthData.profileExternalId);
    formData.append('UserExternalId', adonisAuthData.userExternalId);
    formData.append('PubType', pubType);
    formData.append('TransformType', transformType);
    formData.append('Version', version);

    const response = await adonisApi.post('/file/UploadInputFiles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${adonisAuthData.token}`,
      },
    });

    if (response.data?.Status === true) {
      return {
        success: true,
        requestId: response.data.RequestId,
        message: response.data.Message,
      };
    } else {
      return {
        success: false,
        message: response.data?.Message || 'File upload failed',
      };
    }
  } catch (error) {
    console.error('ADONIS Upload Error:', error);
    return {
      success: false,
      message: error.message || 'File upload failed',
    };
  }
};

/**
 * Trigger transformation process
 * @param {string} requestId - Request ID from upload
 * @returns {Promise<Object>} - Transformation status and any DMRL errors
 */
const transform = async (requestId) => {
  if (!adonisAuthData) {
    return {
      success: false,
      message: 'Not authenticated. Please authenticate first.',
    };
  }

  try {
    const response = await adonisApi.post(
      '/file/Transform',
      {
        RequestId: requestId,
        ProfileExternalId: adonisAuthData.profileExternalId,
        UserExternalId: adonisAuthData.userExternalId,
      },
      {
        headers: {
          Authorization: `Bearer ${adonisAuthData.token}`,
        },
      }
    );

    // Status: 0 = Success, 1 = Failure
    if (response.data?.Status === 0) {
      return {
        success: true,
        messages: response.data.Messages || [],
        errors: response.data.Errors || [],
      };
    } else {
      return {
        success: false,
        messages: response.data?.Messages || [],
        errors: response.data?.Errors || [],
        message: response.data?.Errors?.[0] || 'Transformation failed',
      };
    }
  } catch (error) {
    console.error('ADONIS Transform Error:', error);
    return {
      success: false,
      message: error.message || 'Transformation failed',
    };
  }
};

/**
 * Get transformation status
 * @param {string} requestId - Request ID from upload
 * @returns {Promise<Object>} - Processing status (1=InProgress, 2=Success, 3=Failure)
 */
const getTransformStatus = async (requestId) => {
  if (!adonisAuthData) {
    return {
      success: false,
      message: 'Not authenticated. Please authenticate first.',
    };
  }

  try {
    const response = await adonisApi.post(
      '/file/GetTransformStatus',
      {
        RequestId: requestId,
        ProfileExternalId: adonisAuthData.profileExternalId,
      },
      {
        headers: {
          Authorization: `Bearer ${adonisAuthData.token}`,
        },
      }
    );

    return {
      success: true,
      processingStatus: response.data.ProcessingStatus,
      // 1 = InProgress, 2 = Success, 3 = Failure
      statusText: getStatusText(response.data.ProcessingStatus),
    };
  } catch (error) {
    console.error('ADONIS GetTransformStatus Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to get transform status',
    };
  }
};

/**
 * Download transformed output files
 * @param {string} requestId - Request ID from upload
 * @returns {Promise<Blob>} - ZIP file containing XML and log files
 */
const downloadOutputFiles = async (requestId) => {
  if (!adonisAuthData) {
    return {
      success: false,
      message: 'Not authenticated. Please authenticate first.',
    };
  }

  try {
    const response = await adonisApi.post(
      '/file/DownloadOutputFiles',
      {
        RequestId: requestId,
        ProfileExternalId: adonisAuthData.profileExternalId,
      },
      {
        headers: {
          Authorization: `Bearer ${adonisAuthData.token}`,
        },
        responseType: 'blob',
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('ADONIS Download Error:', error);
    return {
      success: false,
      message: error.message || 'Download failed',
    };
  }
};

/**
 * Step 1: Validate DMRL - POST /DMRL/ValidateDMRL
 * Payload format (multipart/form-data):
 * - {filename}: file (field name = filename)
 * - option: S1000D/ATA/DITA
 * - pubtype: Publication type (CMM/OIM)
 * - actiontype: Transform
 */
const validateDMRL = async ({
  legacyFile,
  dmrlFile,
  option = 'S1000D',
  pubtype = 'CMM',
  actiontype = 'Transform',
}) => {
  try {
    const formData = new FormData();

    // Append files - field name = filename (as per hcl.adonis.ui)
    formData.append(dmrlFile.name, dmrlFile);  // DMRL file
    formData.append(legacyFile.name, legacyFile);  // Legacy file

    // Append other parameters
    formData.append('option', option);
    formData.append('pubtype', pubtype);
    formData.append('actiontype', actiontype);

    const response = await adonisApi.post('/DMRL/ValidateDMRL', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Check for validation errors
    if (response.data?.invalidTemplate === 'True') {
      return {
        success: false,
        message: 'DMRL template mismatch',
        data: response.data,
      };
    }

    if (response.data?.errors && response.data.errors.length > 0) {
      return {
        success: false,
        message: 'DMRL validation errors found',
        errors: response.data.errors,
        data: response.data,
      };
    }

    return {
      success: true,
      data: response.data,
      manualNumber: response.data?.manualNumber,
      message: 'DMRL validation successful',
    };
  } catch (error) {
    console.error('ADONIS ValidateDMRL Error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'DMRL validation failed',
      error: error.response?.data,
    };
  }
};

/**
 * Step 2: Validate Files - POST /file/validatefiles
 * Checks if file exists or needs new upload
 */
const validateFiles = async ({
  profileExternalId,
  pubType,
  manualName,
  userExternalId,
  outputType = 'S1000D',
  version = '4.2',
  fileType = 'PDF',
}) => {
  try {
    const response = await adonisApi.post('/file/validatefiles', {
      ProfileExternalID: profileExternalId,
      PubType: pubType,
      ManualName: manualName,
      UserExternalID: userExternalId,
      OutputType: outputType,
      Version: version,
      FileType: fileType,
    });

    return {
      success: true,
      data: response.data,
      status: response.data?.status, // NewUpload, TransformationCompleted, TransformationNotStarted, NoAccess
      message: response.data?.Message || 'File validation successful',
    };
  } catch (error) {
    console.error('ADONIS ValidateFiles Error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'File validation failed',
      error: error.response?.data,
    };
  }
};

/**
 * Step 3A: Upload New File - POST /file/uploadfile
 * For new file uploads
 */
const uploadFile = async ({
  legacyFile,
  dmrlFile,
  pubType,
  manualName,
  userExternalId,
  profileExternalId,
  transformType = 'S1000D',
  version = '4.2',
  fileType = 'PDF',
}) => {
  try {
    const formData = new FormData();

    // Append files - field name = filename (as per hcl.adonis.ui)
    formData.append(dmrlFile.name, dmrlFile);
    formData.append(legacyFile.name, legacyFile);

    formData.append('PubType', pubType);
    formData.append('ManualName', manualName);
    formData.append('UserExternalID', userExternalId);
    formData.append('ProfileExternalId', profileExternalId);
    formData.append('TransformType', transformType);
    formData.append('Version', version);
    formData.append('FileType', fileType);

    const response = await adonisApi.post('/file/uploadfile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: response.data?.status === true,
      data: response.data,
      message: response.data?.status ? 'File uploaded successfully' : 'File upload failed',
    };
  } catch (error) {
    console.error('ADONIS UploadFile Error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'File upload failed',
      error: error.response?.data,
    };
  }
};

/**
 * Step 3B: Update Existing File - POST /file/updatefile
 * For re-uploading/updating existing files
 */
const updateFile = async ({
  legacyFile,
  dmrlFile,
  pubType,
  manualName,
  userExternalId,
  profileExternalId,
  transformType = 'S1000D',
  version = '4.2',
  isReUpload = true,
  fileType = 'PDF',
}) => {
  try {
    const formData = new FormData();

    // Append files - field name = filename (as per hcl.adonis.ui)
    formData.append(dmrlFile.name, dmrlFile);
    formData.append(legacyFile.name, legacyFile);

    formData.append('PubType', pubType);
    formData.append('ManualName', manualName);
    formData.append('UserExternalID', userExternalId);
    formData.append('ProfileExternalId', profileExternalId);
    formData.append('TransformType', transformType);
    formData.append('Version', version);
    formData.append('IsReUpload', isReUpload);
    formData.append('FileType', fileType);
    formData.append('ActionType', 'Transform');

    const response = await adonisApi.post('/file/updatefile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: response.data?.status === true,
      data: response.data,
      isQueuedAlready: response.data?.isQueuedAlready,
      message: response.data?.status ? 'File updated successfully' : 'File update failed',
    };
  } catch (error) {
    console.error('ADONIS UpdateFile Error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'File update failed',
      error: error.response?.data,
    };
  }
};

/**
 * Step 4: Transform Manual - POST /Transform/TransformManual
 * Final transformation call
 */
const transformManual = async ({
  pubType,
  manualName,
  userExternalId,
  profileExternalId,
  transformType = 'S1000D',
  version = '4.2',
  fileType = 'PDF',
  actionType,
  imgRelPath,
}) => {
  try {
    const formData = new FormData();

    formData.append('PubType', pubType);
    formData.append('ManualName', manualName);
    formData.append('UserExternalID', userExternalId);
    formData.append('ProfileExternalId', profileExternalId);
    formData.append('TransformType', transformType);
    formData.append('Version', version);
    formData.append('FileType', fileType);
    formData.append('ActionType', actionType);
    formData.append('ImgRelPath', imgRelPath);

    const response = await adonisApi.post('/Transform/TransformManual', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('TransformManual API response:', response.data);

    // Check for various success indicators: status === 2, status === 'Success', status === true, Status === true
    const status = response.data?.status || response.data?.Status;
    const isSuccess = status === 2 || status === 'Success' || status === true;
    return {
      success: isSuccess,
      data: response.data,
      message: response.data?.message || response.data?.Message || (isSuccess ? 'Transformation initiated successfully' : 'Transformation failed'),
    };
  } catch (error) {
    console.error('ADONIS TransformManual Error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Transformation failed',
      error: error.response?.data,
    };
  }
};

/**
 * Transform files - Complete flow
 * Step 1: ValidateDMRL
 * Step 2: ValidateFiles
 * Step 3: UploadFile or UpdateFile (based on status)
 * Step 4: TransformManual
 */
const transformFiles = async ({
  legacyFile,
  dmrlFile,
  option = 'S1000D',
  pubtype = 'CMM',
  version = '4.2',
  profileExternalId = '8da86bfe-1a34-4701-b42c-76bc057714b3',
  userExternalId = 'c7f45eb1-af34-11f0-80ca-6045bd2c9c8b',
  actionType,
  imgRelPath,
  onProgress,
}) => {
  try {
    // Get file extension
    const fileExtension = legacyFile.name.split('.').pop().toUpperCase();

    // Step 1: Validate DMRL
    if (onProgress) onProgress('Validating DMRL...');

    const dmrlResult = await validateDMRL({
      legacyFile,
      dmrlFile,
      option,
      pubtype,
    });

    if (!dmrlResult.success) {
      return dmrlResult;
    }

    // Get manual name from DMRL validation response
    const manualName = dmrlResult.manualNumber || legacyFile.name.replace(/\.[^/.]+$/, '');

    // Step 2: Validate Files
    if (onProgress) onProgress('Validating files...');

    const validateResult = await validateFiles({
      profileExternalId,
      pubType: pubtype,
      manualName,
      userExternalId,
      outputType: option,
      version,
      fileType: fileExtension,
    });

    if (!validateResult.success) {
      return validateResult;
    }

    // Step 3: Upload or Update based on status
    const fileStatus = validateResult.status;

    if (fileStatus === 'NoAccess') {
      return {
        success: false,
        message: 'No access to upload files',
      };
    }

    let uploadResult;

    if (fileStatus === 'NewUpload') {
      // New file upload
      if (onProgress) onProgress('Uploading files...');

      uploadResult = await uploadFile({
        legacyFile,
        dmrlFile,
        pubType: pubtype,
        manualName,
        userExternalId,
        profileExternalId,
        transformType: option,
        version,
        fileType: fileExtension,
      });
    } else {
      // Update existing file (TransformationCompleted or TransformationNotStarted)
      if (onProgress) onProgress('Updating files...');

      uploadResult = await updateFile({
        legacyFile,
        dmrlFile,
        pubType: pubtype,
        manualName,
        userExternalId,
        profileExternalId,
        transformType: option,
        version,
        isReUpload: true,
        fileType: fileExtension,
      });
    }

    if (!uploadResult.success) {
      return uploadResult;
    }

    // Step 4: Transform Manual
    if (onProgress) onProgress('Starting transformation...');

    const transformResult = await transformManual({
      pubType: pubtype,
      manualName,
      userExternalId,
      profileExternalId,
      transformType: option,
      version,
      fileType: fileExtension,
      actionType,
      imgRelPath,
    });

    // Include manualName and other params in the result for status API call
    return {
      ...transformResult,
      manualName,
      profileExternalId,
      userExternalId,
      pubType: pubtype,
      transformType: option,
      version,
    };
  } catch (error) {
    console.error('ADONIS Transform Error:', error);
    return {
      success: false,
      message: error.message || 'Transformation failed',
      error: error,
    };
  }
};

/**
 * Get Transform Status from Search API - POST /Search/GetTransformStatus
 * Called after successful transform to get status and file details
 * @param {Object} params - Search parameters
 * @param {string} params.actionType - Action type (Transform)
 * @param {string} params.profileExternalId - Profile External ID
 * @param {string} params.pubtype - Publication type (CMM/OIM)
 * @param {string} params.transformationtype - Transformation type (S1000D)
 * @param {string} params.userExternalID - User External ID
 * @returns {Promise<Object>} - Transform status with file details
 */
const getSearchTransformStatus = async ({
  actionType = 'Transform',
  profileExternalId,
  pubtype = '',
  transformationtype = 'S1000D',
  userExternalID,
}) => {
  try {
    const response = await adonisApi.post('/Search/GetTransformStatus', {
      actionType,
      profileExternalId,
      pubtype,
      transformationtype,
      userExternalID,
    });

    console.log('GetSearchTransformStatus API response:', response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('ADONIS GetSearchTransformStatus Error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to get transform status',
      error: error.response?.data,
    };
  }
};

/**
 * Download output file - GET /file/downloadfile
 * @param {string} filePath - File path to download
 * @param {string} fileName - File name for download
 * @returns {Promise<Object>} - Download result with blob data
 */
const downloadFile = async (filePath, fileName) => {
  try {
    const response = await adonisApi.get('/file/downloadfile', {
      params: {
        filePath: filePath,
      },
      responseType: 'blob',
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || 'download');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return {
      success: true,
      message: 'File downloaded successfully',
    };
  } catch (error) {
    console.error('ADONIS Download File Error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'File download failed',
      error: error.response?.data,
    };
  }
};

/**
 * Check ADONIS API health status
 * @returns {Promise<Object>} - Health status
 */
const heartbeat = async () => {
  try {
    const response = await adonisApi.get('/Heartbeat');
    return {
      success: response.data?.Status === true,
      status: response.data?.Status,
    };
  } catch (error) {
    console.error('ADONIS Heartbeat Error:', error);
    return {
      success: false,
      message: error.message || 'Heartbeat failed',
    };
  }
};

// Helper function to get status text
const getStatusText = (status) => {
  switch (status) {
    case 1:
      return 'InProgress';
    case 2:
      return 'Success';
    case 3:
      return 'Failure';
    default:
      return 'Unknown';
  }
};

// Helper to check if authenticated
// For transformFiles (public API), always return true
const isAuthenticated = () => {
  return true;
};

// Helper to get current auth data
const getAuthData = () => {
  return adonisAuthData;
};

// Helper to clear auth data
const clearAuth = () => {
  adonisAuthData = null;
};

const adonisService = {
  setDevToken,
  getDevToken,
  clearDevToken,
  authenticate,
  uploadInputFiles,
  transform,
  validateDMRL,
  validateFiles,
  uploadFile,
  updateFile,
  transformManual,
  transformFiles,
  getTransformStatus,
  getSearchTransformStatus,
  downloadOutputFiles,
  downloadFile,
  heartbeat,
  isAuthenticated,
  getAuthData,
  clearAuth,
};

export default adonisService;
