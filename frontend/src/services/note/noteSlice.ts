import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import noteService from './noteService';
import { RootState } from '@/redux/store';

interface Note {
  _id: string;
  email: string;
  service: string;
  content: string;
}

interface NoteState {
  notes: Note[] | null;
  note: Note | null;
  loading: boolean;
  error: string | null;
}

const initialState: NoteState = {
  notes: null,
  note: null,
  loading: false,
  error: null,
};

// Thunk to get list of Notes
export const getNotes = createAsyncThunk('notes/getNotes', async (_, thunkAPI) => {
  try {
    const token = (thunkAPI.getState() as RootState).auth.user?.token;
    if (!token) throw new Error('User token is missing');
    return await noteService.getNotes(token);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Thunk to create a new Note
export const createNote = createAsyncThunk('notes/createNote', async (noteData: {email: string, service: string, content: string }, thunkAPI) => {
  try {
    
    return await noteService.createNote(noteData);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Thunk to delete a Note
export const deleteNote = createAsyncThunk('notes/deleteNote', async (id: string, thunkAPI) => {
  try {
    const token = (thunkAPI.getState() as RootState).auth.user?.token;
    if (!token) throw new Error('User token is missing');
    await noteService.deleteNote(id, token);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        if (state.notes) {
          state.notes.push(action.payload);
        } else {
          state.notes = [action.payload];
        }
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        if (state.notes) {
          state.notes = state.notes.filter(note => note._id !== action.payload);
        }
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default noteSlice.reducer;
