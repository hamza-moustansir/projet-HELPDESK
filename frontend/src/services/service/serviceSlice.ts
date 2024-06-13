import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import serviceService from './serviceService';
import { RootState } from '@/redux/store';

// Thunk to get list of services
export const getServices = createAsyncThunk('services/getServices', async (_, thunkAPI) => {
  try {
   
    return await serviceService.getServices();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Thunk to get service details
export const getServiceDetails = createAsyncThunk('services/getServiceDetails', async (id: string, thunkAPI) => {
  try {
    return await serviceService.getServiceDetails(id);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Thunk to create a new service
export const createService = createAsyncThunk('services/createService', async (serviceData: { name: string, responsibleAgent: string }, thunkAPI) => {
  try {
    const token = (thunkAPI.getState() as RootState).auth.user?.token;
    if (!token) throw new Error('User token is missing');
    return await serviceService.createService(serviceData, token);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Thunk to update a service
export const updateService = createAsyncThunk('services/updateService', async ({ id, serviceData }: { id: string, serviceData: { name?: string, responsibleAgent?: string } }, thunkAPI) => {
  try {
    const token = (thunkAPI.getState() as RootState).auth.user?.token;
    if (!token) throw new Error('User token is missing');
    return await serviceService.updateService(id, serviceData, token);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Thunk to delete a service
export const deleteService = createAsyncThunk('services/deleteService', async (id: string, thunkAPI) => {
  try {
    const token = (thunkAPI.getState() as RootState).auth.user?.token;
    if (!token) throw new Error('User token is missing');
    await serviceService.deleteService(id, token);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Slice for services
const serviceSlice = createSlice({
  name: 'service',
  initialState: {
    services: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(getServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getServiceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceDetails.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.services.findIndex(service => service._id === action.payload._id);
        if (index !== -1) {
          state.services[index] = action.payload;
        } else {
          state.services.push(action.payload);
        }
      })
      .addCase(getServiceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.services.findIndex(service => service._id === action.payload._id);
        if (index !== -1) {
          state.services[index] = {...state.services[index], name: action.payload.name, responsibleAgent:{_id:action.payload.responsibleAgent}};
          console.log(state.services[index]);
          console.log(action.payload);
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter(service => service._id !== action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default serviceSlice.reducer;
