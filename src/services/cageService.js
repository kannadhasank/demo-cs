import axios from 'axios';

// Mock CAGE data
const MOCK_CAGES = [
  {
    id: 1,
    cageCode: 'EPS0001',
    name: 'Lorem ipsum',
    street: 'Ipsum dolor sit amet...',
    city: 'Lorem ipsum',
    state: 'Lorem ipsum',
    country: 'Lorem ipsum',
    postCode: '85720',
  },
  {
    id: 2,
    cageCode: 'EPS0001',
    name: 'Lorem ipsum',
    street: 'Ipsum dolor sit amet...',
    city: 'Lorem ipsum',
    state: 'Lorem ipsum',
    country: 'Lorem ipsum',
    postCode: '85720',
  },
  {
    id: 3,
    cageCode: 'EPS0001',
    name: 'Lorem ipsum',
    street: 'Ipsum dolor sit amet...',
    city: 'Lorem ipsum',
    state: 'Lorem ipsum',
    country: 'Lorem ipsum',
    postCode: '85720',
  },
  {
    id: 4,
    cageCode: 'EPS0001',
    name: 'Lorem ipsum',
    street: 'Ipsum dolor sit amet...',
    city: 'Lorem ipsum',
    state: 'Lorem ipsum',
    country: 'Lorem ipsum',
    postCode: '85720',
  },
  {
    id: 5,
    cageCode: 'EPS0001',
    name: 'Lorem ipsum',
    street: 'Ipsum dolor sit amet...',
    city: 'Lorem ipsum',
    state: 'Lorem ipsum',
    country: 'Lorem ipsum',
    postCode: '85720',
  },
  {
    id: 6,
    cageCode: 'EPS0001',
    name: 'Lorem ipsum',
    street: 'Ipsum dolor sit amet...',
    city: 'Lorem ipsum',
    state: 'Lorem ipsum',
    country: 'Lorem ipsum',
    postCode: '85720',
  },
  {
    id: 7,
    cageCode: 'EPS0001',
    name: 'Lorem ipsum',
    street: 'Ipsum dolor sit amet...',
    city: 'Lorem ipsum',
    state: 'Lorem ipsum',
    country: 'Lorem ipsum',
    postCode: '85720',
  },
  {
    id: 8,
    cageCode: 'EPS0001',
    name: 'Lorem ipsum',
    street: 'Ipsum dolor sit amet...',
    city: 'Lorem ipsum',
    state: 'Lorem ipsum',
    country: 'Lorem ipsum',
    postCode: '85720',
  },
  {
    id: 9,
    cageCode: 'EPS0001',
    name: 'Lorem ipsum',
    street: 'Ipsum dolor sit amet...',
    city: 'Lorem ipsum',
    state: 'Lorem ipsum',
    country: 'Lorem ipsum',
    postCode: '85720',
  },
  {
    id: 10,
    cageCode: 'EPS0001',
    name: 'Lorem ipsum',
    street: 'Ipsum dolor sit amet...',
    city: 'Lorem ipsum',
    state: 'Lorem ipsum',
    country: 'Lorem ipsum',
    postCode: '85720',
  },
];

// Get all cages
const getCages = async (params = {}) => {
  // TODO: Replace with actual API call
  // const response = await axios.get('/api/cages', { params });
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const { page = 1, perPage = 10, search = '' } = params;
      
      let filteredCages = [...MOCK_CAGES];
      
      // Apply search filter
      if (search) {
        filteredCages = filteredCages.filter(
          (cage) =>
            cage.cageCode.toLowerCase().includes(search.toLowerCase()) ||
            cage.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      const total = filteredCages.length;
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedCages = filteredCages.slice(startIndex, endIndex);
      
      resolve({
        data: paginatedCages,
        pagination: {
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage),
        },
      });
    }, 500);
  });
};

// Get single cage
const getCage = async (id) => {
  // TODO: Replace with actual API call
  // const response = await axios.get(`/api/cages/${id}`);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cage = MOCK_CAGES.find((c) => c.id === parseInt(id));
      
      if (cage) {
        resolve(cage);
      } else {
        reject(new Error('CAGE not found'));
      }
    }, 500);
  });
};

// Create cage
const createCage = async (cageData) => {
  // TODO: Replace with actual API call
  // const response = await axios.post('/api/cages', cageData);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCage = {
        id: Date.now(),
        ...cageData,
      };
      
      MOCK_CAGES.push(newCage);
      resolve(newCage);
    }, 500);
  });
};

// Update cage
const updateCage = async (id, cageData) => {
  // TODO: Replace with actual API call
  // const response = await axios.put(`/api/cages/${id}`, cageData);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_CAGES.findIndex((c) => c.id === parseInt(id));
      
      if (index !== -1) {
        MOCK_CAGES[index] = { ...MOCK_CAGES[index], ...cageData };
        resolve(MOCK_CAGES[index]);
      } else {
        reject(new Error('CAGE not found'));
      }
    }, 500);
  });
};

// Delete cage
const deleteCage = async (id) => {
  // TODO: Replace with actual API call
  // const response = await axios.delete(`/api/cages/${id}`);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_CAGES.findIndex((c) => c.id === parseInt(id));
      
      if (index !== -1) {
        MOCK_CAGES.splice(index, 1);
        resolve(id);
      } else {
        reject(new Error('CAGE not found'));
      }
    }, 500);
  });
};

const cageService = {
  getCages,
  getCage,
  createCage,
  updateCage,
  deleteCage,
};

export default cageService;
