import api from './api';

// Mock End Item data - Start with empty array
const MOCK_END_ITEMS = [];

// Get all end items
const getEndItems = async (params = {}) => {
  // TODO: Replace mock data with actual API call when backend is ready
  // Example: const response = await api.get('/end-items', { params });
  // return response.data;

  return new Promise((resolve) => {
    setTimeout(() => {
      const { page = 1, perPage = 10, search = '' } = params;

      let filteredEndItems = [...MOCK_END_ITEMS];

      // Apply search filter
      if (search) {
        filteredEndItems = filteredEndItems.filter(
          (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.specification.toLowerCase().includes(search.toLowerCase()) ||
            item.issue.toLowerCase().includes(search.toLowerCase())
        );
      }

      const total = filteredEndItems.length;
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedEndItems = filteredEndItems.slice(startIndex, endIndex);

      resolve({
        data: paginatedEndItems,
        pagination: {
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage),
        },
      });
    }, 300);
  });
};

// Get single end item
const getEndItem = async (id) => {
  // TODO: Replace with actual API call
  // const response = await api.get(`/end-items/${id}`);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const endItem = MOCK_END_ITEMS.find((item) => item.id === parseInt(id));

      if (endItem) {
        resolve(endItem);
      } else {
        reject(new Error('End Item not found'));
      }
    }, 500);
  });
};

// Create end item
const createEndItem = async (endItemData) => {
  // TODO: Replace with actual API call
  // const response = await api.post('/end-items', endItemData);

  return new Promise((resolve) => {
    setTimeout(() => {
      const newEndItem = {
        id: Date.now(),
        ...endItemData,
      };

      MOCK_END_ITEMS.push(newEndItem);
      resolve(newEndItem);
    }, 300);
  });
};

// Update end item
const updateEndItem = async (id, endItemData) => {
  // TODO: Replace with actual API call
  // const response = await api.put(`/end-items/${id}`, endItemData);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_END_ITEMS.findIndex((item) => item.id === parseInt(id));

      if (index !== -1) {
        MOCK_END_ITEMS[index] = { ...MOCK_END_ITEMS[index], ...endItemData };
        resolve(MOCK_END_ITEMS[index]);
      } else {
        reject(new Error('End Item not found'));
      }
    }, 500);
  });
};

// Delete end item
const deleteEndItem = async (id) => {
  // TODO: Replace with actual API call
  // const response = await api.delete(`/end-items/${id}`);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_END_ITEMS.findIndex((item) => item.id === parseInt(id));

      if (index !== -1) {
        MOCK_END_ITEMS.splice(index, 1);
        resolve(id);
      } else {
        reject(new Error('End Item not found'));
      }
    }, 500);
  });
};

const endItemService = {
  getEndItems,
  getEndItem,
  createEndItem,
  updateEndItem,
  deleteEndItem,
};

export default endItemService;
