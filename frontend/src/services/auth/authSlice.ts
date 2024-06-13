import { createSlice, createAsyncThunk, createAction, PayloadAction } from '@reduxjs/toolkit';
import authService from './authService';
import { extractErrorMessage } from '../../utils';

interface User {
  _id?: string;
  name: string;
  email: string;
  role: 'Employe' | 'Agent' | 'Admin';
  token?: string;
}

interface AuthState {
  user: User | null | undefined;
  users: User[] | null;
  isLoading: boolean;
}

// Get user from localstorage
const user: User | null = JSON.parse(localStorage.getItem('user') || 'null');

const initialState: AuthState = {
  user: user ? user : null,
  users: null,
  isLoading: false,
};

// Register new user
export const register = createAsyncThunk(
  'auth/register',
  async (user: User, thunkAPI) => {
    try {
      return await authService.register(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Login user
export const login = createAsyncThunk('auth/login', async (user: User, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});

// Get all users
export const getUsers = createAsyncThunk('auth/getUsers', async (_, thunkAPI) => {
  try {
    return await authService.getUsers();
  } catch (error) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});

// Delete a user
export const deleteUser = createAsyncThunk('auth/deleteUser', async (userId: string, thunkAPI) => {
  try {
    await authService.deleteUser(userId);
    return userId;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});

// Logout user
export const logout = createAction('auth/logout', () => {
  authService.logout();
  return { payload: undefined };
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User | undefined>) => {
        // No need to update state.user
        state.users = [...(state.users || []), action.payload];
        state.isLoading = false;
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action: PayloadAction<User[] | undefined>) => {
        state.users = action.payload || null;
        state.isLoading = false;
      })
      .addCase(getUsers.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        if (state.users) {
          state.users = state.users.filter(user => user._id !== action.payload);
        }
        state.isLoading = false;
      })
      .addCase(deleteUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
