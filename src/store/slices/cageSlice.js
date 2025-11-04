import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cageService from '@services/cageService';

const initialState = {
  cages: [],
  currentCage: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  pagination: {
    page: 1,
    perPage: 10,
    total: 0,
  },
};

// Get all cages
export const getCages = createAsyncThunk('cage/getAll', async (params, thunkAPI) => {
  try {
    return await cageService.getCages(params);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get single cage
export const getCage = createAsyncThunk('cage/getOne', async (id, thunkAPI) => {
  try {
    return await cageService.getCage(id);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Create cage
export const createCage = createAsyncThunk('cage/create', async (cageData, thunkAPI) => {
  try {
    return await cageService.createCage(cageData);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Update cage
export const updateCage = createAsyncThunk('cage/update', async ({ id, data }, thunkAPI) => {
  try {
    return await cageService.updateCage(id, data);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Delete cage
export const deleteCage = createAsyncThunk('cage/delete', async (id, thunkAPI) => {
  try {
    return await cageService.deleteCage(id);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const cageSlice = createSlice({
  name: 'cage',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setCurrentCage: (state, action) => {
      state.currentCage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cages = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getCages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentCage = action.payload;
      })
      .addCase(getCage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createCage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cages.push(action.payload);
      })
      .addCase(createCage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateCage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.cages.findIndex((cage) => cage.id === action.payload.id);
        if (index !== -1) {
          state.cages[index] = action.payload;
        }
        state.currentCage = action.payload;
      })
      .addCase(updateCage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteCage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cages = state.cages.filter((cage) => cage.id !== action.payload);
      })
      .addCase(deleteCage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, setCurrentCage } = cageSlice.actions;
export default cageSlice.reducer;
