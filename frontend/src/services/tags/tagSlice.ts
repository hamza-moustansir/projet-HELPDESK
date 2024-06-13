// tagSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import tagService from './tagService';

interface TagState {
  tags: string[];
  loading: boolean;
  error: string | null;
}

const initialState: TagState = {
  tags: [],
  loading: false,
  error: null,
};

// Thunk to get list of tags
export const getTags = createAsyncThunk('tags/getTags', async (_, thunkAPI) => {
  try {
    const token = (thunkAPI.getState() as RootState).auth.user?.token;
    if (!token) throw new Error('User token is missing');
    return await tagService.getTags(token);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(getTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default tagSlice.reducer;
