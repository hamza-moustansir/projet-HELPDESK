import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import articleService from './articleService';
import { RootState } from '@/redux/store';

interface Article {
  _id: string;
  // Define the structure of an Article if necessary
}

interface ArticleState {
  articles: Article[] | null;
  article: Article | null;
  loading: boolean;
  error: string | null;
}

const initialState: ArticleState = {
  articles: null,
  article: null,
  loading: false,
  error: null,
};

// Thunk to get list of articles
export const getArticles = createAsyncThunk('articles/getArticles', async (_, thunkAPI) => {
  try {
    const token = (thunkAPI.getState() as RootState).auth.user?.token;
    if (!token) throw new Error('User token is missing');
    return await articleService.getArticles(token);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Thunk to get an article
export const getArticle = createAsyncThunk('articles/getArticle', async (id: string, thunkAPI) => {
  try {
    return await articleService.getArticle(id);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Thunk to create a new article
export const createArticle = createAsyncThunk('articles/createArticle', async (articleData: { title: string, content: string, author: string }, thunkAPI) => {
  try {
    const token = (thunkAPI.getState() as RootState).auth.user?.token;
    if (!token) throw new Error('User token is missing');
    return await articleService.createArticle(articleData, token);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Thunk to update an article
export const updateArticle = createAsyncThunk('articles/updateArticle', async ({ id, articleData }: { id: string; articleData: { title?: string; content?: string } }, thunkAPI) => {
  try {
    const token = (thunkAPI.getState() as RootState).auth.user?.token;
    if (!token) throw new Error('User token is missing');
    return await articleService.updateArticle(id, articleData, token);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Thunk to delete an article
export const deleteArticle = createAsyncThunk('articles/deleteArticle', async (id: string, thunkAPI) => {
  try {
    const token = (thunkAPI.getState() as RootState).auth.user?.token;
    if (!token) throw new Error('User token is missing');
    await articleService.deleteArticle(id, token);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Thunk to search for articles
export const searchArticles = createAsyncThunk('articles/searchArticles', async (query: string, thunkAPI) => {
  try {
    const token = (thunkAPI.getState() as RootState).auth.user?.token;
    if (!token) throw new Error('User token is missing');
    return await articleService.searchArticles(query, token);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(getArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.article = action.payload;
      })
      .addCase(getArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.loading = false;
        if (state.articles) {
          state.articles.push(action.payload);
        } else {
          state.articles = [action.payload];
        }
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.loading = false;
        if (state.articles) {
          const index = state.articles.findIndex(article => article._id === action.payload._id);
          if (index !== -1) {
            state.articles[index] = {...state.articles[index], title:action.payload.title};
          }
        }
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.loading = false;
        if (state.articles) {
          state.articles = state.articles.filter(article => article._id !== action.payload);
        }
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(searchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default articleSlice.reducer;
