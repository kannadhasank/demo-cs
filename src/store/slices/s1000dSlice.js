import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import s1000dService from '@services/s1000dService';

// Async thunks
export const getTransformations = createAsyncThunk(
  's1000d/getAll',
  async (params, thunkAPI) => {
    try {
      return await s1000dService.getTransformations(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createTransformation = createAsyncThunk(
  's1000d/create',
  async (transformationData, thunkAPI) => {
    try {
      return await s1000dService.createTransformation(transformationData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTransformation = createAsyncThunk(
  's1000d/getOne',
  async (id, thunkAPI) => {
    try {
      return await s1000dService.getTransformation(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateTransformation = createAsyncThunk(
  's1000d/update',
  async ({ id, data }, thunkAPI) => {
    try {
      return await s1000dService.updateTransformation(id, data);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteTransformation = createAsyncThunk(
  's1000d/delete',
  async (id, thunkAPI) => {
    try {
      return await s1000dService.deleteTransformation(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const validateTransformation = createAsyncThunk(
  's1000d/validate',
  async (data, thunkAPI) => {
    try {
      return await s1000dService.validateTransformation(data);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const validateBrex = createAsyncThunk(
  's1000d/brexValidate',
  async (data, thunkAPI) => {
    try {
      return await s1000dService.validateBrex(data);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const generatePmc = createAsyncThunk(
  's1000d/generatePmc',
  async (data, thunkAPI) => {
    try {
      return await s1000dService.generatePmc(data);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const publishTransformation = createAsyncThunk(
  's1000d/publish',
  async (data, thunkAPI) => {
    try {
      return await s1000dService.publishTransformation(data);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const downloadTemplate = createAsyncThunk(
  's1000d/downloadTemplate',
  async (templateType, thunkAPI) => {
    try {
      return await s1000dService.downloadTemplate(templateType);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  transformations: [],
  currentTransformation: null,
  isLoading: false,
  isSaving: false,
  isValidating: false,
  isPublishing: false,
  isSuccess: false,
  isError: false,
  message: '',
  pagination: {
    page: 1,
    perPage: 10,
    total: 0,
  },
};

export const s1000dSlice = createSlice({
  name: 's1000d',
  initialState,
  reducers: {
    reset: (state) => {
      state.isSaving = false;
      state.isValidating = false;
      state.isPublishing = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentTransformation: (state) => {
      state.currentTransformation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get transformations
      .addCase(getTransformations.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getTransformations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.transformations = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getTransformations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create transformation
      .addCase(createTransformation.pending, (state) => {
        state.isSaving = true;
        state.isError = false;
      })
      .addCase(createTransformation.fulfilled, (state, action) => {
        state.isSaving = false;
        state.isSuccess = true;
        state.transformations.unshift(action.payload);
        state.message = 'Request for Legacy manual transformation initiated. You will be notified via email once transformation is completed.';
      })
      .addCase(createTransformation.rejected, (state, action) => {
        state.isSaving = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get transformation
      .addCase(getTransformation.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getTransformation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentTransformation = action.payload;
      })
      .addCase(getTransformation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update transformation
      .addCase(updateTransformation.pending, (state) => {
        state.isSaving = true;
        state.isError = false;
      })
      .addCase(updateTransformation.fulfilled, (state, action) => {
        state.isSaving = false;
        state.isSuccess = true;
        const index = state.transformations.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.transformations[index] = action.payload;
        }
        state.message = 'Transformation updated successfully';
      })
      .addCase(updateTransformation.rejected, (state, action) => {
        state.isSaving = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete transformation
      .addCase(deleteTransformation.pending, (state) => {
        state.isSaving = true;
        state.isError = false;
      })
      .addCase(deleteTransformation.fulfilled, (state, action) => {
        state.isSaving = false;
        state.isSuccess = true;
        state.transformations = state.transformations.filter((item) => item.id !== action.payload.id);
        state.message = 'Transformation deleted successfully';
      })
      .addCase(deleteTransformation.rejected, (state, action) => {
        state.isSaving = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Validate transformation
      .addCase(validateTransformation.pending, (state) => {
        state.isValidating = true;
        state.isError = false;
      })
      .addCase(validateTransformation.fulfilled, (state, action) => {
        state.isValidating = false;
        state.isSuccess = true;
        state.message = action.payload.message || 'Validation completed successfully';
      })
      .addCase(validateTransformation.rejected, (state, action) => {
        state.isValidating = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Validate Brex
      .addCase(validateBrex.pending, (state) => {
        state.isValidating = true;
        state.isError = false;
      })
      .addCase(validateBrex.fulfilled, (state, action) => {
        state.isValidating = false;
        state.isSuccess = true;
        state.message = action.payload.message || 'Brex validation completed successfully';
      })
      .addCase(validateBrex.rejected, (state, action) => {
        state.isValidating = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Generate PMC
      .addCase(generatePmc.pending, (state) => {
        state.isSaving = true;
        state.isError = false;
      })
      .addCase(generatePmc.fulfilled, (state, action) => {
        state.isSaving = false;
        state.isSuccess = true;
        state.message = action.payload.message || 'PMC generated successfully';
      })
      .addCase(generatePmc.rejected, (state, action) => {
        state.isSaving = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Publish transformation
      .addCase(publishTransformation.pending, (state) => {
        state.isPublishing = true;
        state.isError = false;
      })
      .addCase(publishTransformation.fulfilled, (state, action) => {
        state.isPublishing = false;
        state.isSuccess = true;
        state.message = action.payload.message || 'Published successfully';
      })
      .addCase(publishTransformation.rejected, (state, action) => {
        state.isPublishing = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Download template
      .addCase(downloadTemplate.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(downloadTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Template downloaded successfully';
      })
      .addCase(downloadTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCurrentTransformation } = s1000dSlice.actions;
export default s1000dSlice.reducer;
