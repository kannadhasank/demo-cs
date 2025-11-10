import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import endItemService from '@services/endItemService';

const initialState = {
  endItems: [],
  currentEndItem: null,
  isLoading: false,
  isSaving: false,
  isSuccess: false,
  isError: false,
  message: '',
  pagination: {
    page: 1,
    perPage: 10,
    total: 0,
  },
};

// Get all end items
export const getEndItems = createAsyncThunk('endItem/getAll', async (params, thunkAPI) => {
  try {
    return await endItemService.getEndItems(params);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get single end item
export const getEndItem = createAsyncThunk('endItem/getOne', async (id, thunkAPI) => {
  try {
    return await endItemService.getEndItem(id);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Create end item
export const createEndItem = createAsyncThunk('endItem/create', async (endItemData, thunkAPI) => {
  try {
    return await endItemService.createEndItem(endItemData);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Update end item
export const updateEndItem = createAsyncThunk('endItem/update', async ({ id, data }, thunkAPI) => {
  try {
    return await endItemService.updateEndItem(id, data);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Delete end item
export const deleteEndItem = createAsyncThunk('endItem/delete', async (id, thunkAPI) => {
  try {
    return await endItemService.deleteEndItem(id);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const endItemSlice = createSlice({
  name: 'endItem',
  initialState,
  reducers: {
    reset: (state) => {
      state.isSaving = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setCurrentEndItem: (state, action) => {
      state.currentEndItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEndItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEndItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.endItems = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getEndItems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getEndItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEndItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentEndItem = action.payload;
      })
      .addCase(getEndItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createEndItem.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(createEndItem.fulfilled, (state, action) => {
        state.isSaving = false;
        state.isSuccess = true;
        state.endItems.push(action.payload);
      })
      .addCase(createEndItem.rejected, (state, action) => {
        state.isSaving = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateEndItem.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(updateEndItem.fulfilled, (state, action) => {
        state.isSaving = false;
        state.isSuccess = true;
        const index = state.endItems.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.endItems[index] = action.payload;
        }
        state.currentEndItem = action.payload;
      })
      .addCase(updateEndItem.rejected, (state, action) => {
        state.isSaving = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteEndItem.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(deleteEndItem.fulfilled, (state, action) => {
        state.isSaving = false;
        state.isSuccess = true;
        state.endItems = state.endItems.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteEndItem.rejected, (state, action) => {
        state.isSaving = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, setCurrentEndItem } = endItemSlice.actions;
export default endItemSlice.reducer;
