import api from './api';

// Mock data for recent transformations
const MOCK_TRANSFORMATIONS = [
  {
    id: 1,
    legacyManual: 'CMM-25-21-60 CMM_DEMO 2.docx',
    documentNo: '25-21-60',
    version: '5.0',
    pubType: 'CMM',
    pages: 75,
    status: 'Yet to Start',
    totalRun: 7,
    date: '11/24/2025 07:12:52 PM',
    targetVersion: 'S1000D',
    publicationType: 'Publication',
    createdAt: new Date('2025-11-24T19:12:52'),
  },
  {
    id: 2,
    legacyManual: 'C25547000MP001.docx',
    documentNo: 'C25547000MP001',
    version: '5.0',
    pubType: 'OIM',
    pages: 10,
    status: 'Transformed',
    totalRun: 1,
    date: '11/24/2025 02:36:32 PM',
    targetVersion: 'S1000D',
    publicationType: 'Publication',
    createdAt: new Date('2025-11-24T14:36:32'),
  },
  {
    id: 3,
    legacyManual: 'C-91-996-001-NP-000.docx',
    documentNo: 'C-91-996-001-NP-000',
    version: '4.2',
    pubType: 'OIM',
    pages: 22,
    status: 'Transformed',
    totalRun: 1,
    date: '11/10/2025 04:25:41 PM',
    targetVersion: 'S1000D',
    publicationType: 'Publication',
    createdAt: new Date('2025-11-10T16:25:41'),
  },
  {
    id: 4,
    legacyManual: '32-11-18_CMM - Copy.docx',
    documentNo: '32-11-18',
    version: '5.0',
    pubType: 'CMM',
    pages: 50,
    status: 'Transformed',
    totalRun: 5,
    date: '10/28/2025 01:23:05 PM',
    targetVersion: 'S1000D',
    publicationType: 'Publication',
    createdAt: new Date('2025-10-28T13:23:05'),
  },
];

// Get all transformations with pagination and search
const getTransformations = async (params = {}) => {
  // TODO: Replace with actual API call when backend is ready
  // const response = await api.get('/s1000d/transformations', { params });
  // return response.data;

  return new Promise((resolve) => {
    setTimeout(() => {
      const { page = 1, perPage = 10, search = '', status = '' } = params;

      let filteredData = [...MOCK_TRANSFORMATIONS];

      // Apply search filter
      if (search) {
        filteredData = filteredData.filter(
          (item) =>
            item.legacyManual.toLowerCase().includes(search.toLowerCase()) ||
            item.documentNo.toLowerCase().includes(search.toLowerCase()) ||
            item.pubType.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply status filter
      if (status) {
        filteredData = filteredData.filter((item) => item.status === status);
      }

      // Sort by date (most recent first)
      filteredData.sort((a, b) => b.createdAt - a.createdAt);

      // Apply pagination
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      resolve({
        data: paginatedData,
        pagination: {
          page,
          perPage,
          total: filteredData.length,
          totalPages: Math.ceil(filteredData.length / perPage),
        },
      });
    }, 300);
  });
};

// Create a new transformation
const createTransformation = async (transformationData) => {
  // TODO: Replace with actual API call when backend is ready
  // const response = await api.post('/s1000d/transformations', transformationData);
  // return response.data;

  return new Promise((resolve) => {
    setTimeout(() => {
      const newTransformation = {
        id: Date.now(),
        legacyManual: transformationData.legacyFile?.name || 'Unknown File',
        documentNo: `DOC-${Math.floor(Math.random() * 10000)}`,
        version: '5.0',
        pubType: transformationData.publicationType || 'Publication',
        pages: Math.floor(Math.random() * 100) + 1,
        status: 'Yet to Start',
        totalRun: 1,
        date: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }),
        targetVersion: transformationData.targetVersion || 'S1000D',
        publicationType: transformationData.publicationType || 'Publication',
        createdAt: new Date(),
      };

      MOCK_TRANSFORMATIONS.unshift(newTransformation);
      resolve(newTransformation);
    }, 2000);
  });
};

// Get a single transformation by ID
const getTransformation = async (id) => {
  // TODO: Replace with actual API call when backend is ready
  // const response = await api.get(`/s1000d/transformations/${id}`);
  // return response.data;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const transformation = MOCK_TRANSFORMATIONS.find((item) => item.id === parseInt(id));
      if (transformation) {
        resolve(transformation);
      } else {
        reject(new Error('Transformation not found'));
      }
    }, 300);
  });
};

// Update a transformation
const updateTransformation = async (id, data) => {
  // TODO: Replace with actual API call when backend is ready
  // const response = await api.put(`/s1000d/transformations/${id}`, data);
  // return response.data;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_TRANSFORMATIONS.findIndex((item) => item.id === parseInt(id));
      if (index !== -1) {
        MOCK_TRANSFORMATIONS[index] = { ...MOCK_TRANSFORMATIONS[index], ...data };
        resolve(MOCK_TRANSFORMATIONS[index]);
      } else {
        reject(new Error('Transformation not found'));
      }
    }, 300);
  });
};

// Delete a transformation
const deleteTransformation = async (id) => {
  // TODO: Replace with actual API call when backend is ready
  // const response = await api.delete(`/s1000d/transformations/${id}`);
  // return response.data;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_TRANSFORMATIONS.findIndex((item) => item.id === parseInt(id));
      if (index !== -1) {
        const deleted = MOCK_TRANSFORMATIONS.splice(index, 1)[0];
        resolve({ id: deleted.id, message: 'Transformation deleted successfully' });
      } else {
        reject(new Error('Transformation not found'));
      }
    }, 300);
  });
};

// Validate transformation
const validateTransformation = async (data) => {
  // TODO: Replace with actual API call when backend is ready
  // const response = await api.post('/s1000d/validate', data);
  // return response.data;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Validation completed successfully',
        errors: [],
        warnings: [],
      });
    }, 1500);
  });
};

// Validate Brex
const validateBrex = async (data) => {
  // TODO: Replace with actual API call when backend is ready
  // const response = await api.post('/s1000d/brex-validate', data);
  // return response.data;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Brex validation completed successfully',
        errors: [],
        warnings: [],
      });
    }, 1500);
  });
};

// Generate PMC
const generatePmc = async (data) => {
  // TODO: Replace with actual API call when backend is ready
  // const response = await api.post('/s1000d/generate-pmc', data);
  // return response.data;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'PMC generated successfully',
        pmcUrl: '/downloads/pmc-123456.xml',
      });
    }, 1500);
  });
};

// Publish transformation
const publishTransformation = async (data) => {
  // TODO: Replace with actual API call when backend is ready
  // const response = await api.post('/s1000d/publish', data);
  // return response.data;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Published successfully',
        publishUrl: '/publications/123456',
      });
    }, 1500);
  });
};

// Download template (DMRL or Configuration)
const downloadTemplate = async (templateType) => {
  // TODO: Replace with actual API call when backend is ready
  // const response = await api.get(`/s1000d/templates/${templateType}`, { responseType: 'blob' });
  // return response.data;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `${templateType} template downloaded successfully`,
        templateUrl: `/templates/${templateType.toLowerCase()}-template.xlsx`,
      });
    }, 500);
  });
};

// Download transformation result
const downloadTransformationResult = async (id) => {
  // TODO: Replace with actual API call when backend is ready
  // const response = await api.get(`/s1000d/transformations/${id}/download`, { responseType: 'blob' });
  // return response.data;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Transformation result downloaded successfully',
        downloadUrl: `/downloads/transformation-${id}.zip`,
      });
    }, 500);
  });
};

const s1000dService = {
  getTransformations,
  createTransformation,
  getTransformation,
  updateTransformation,
  deleteTransformation,
  validateTransformation,
  validateBrex,
  generatePmc,
  publishTransformation,
  downloadTemplate,
  downloadTransformationResult,
};

export default s1000dService;
