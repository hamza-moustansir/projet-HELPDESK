import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../services/auth/authSlice';
import ticketReducer from '../services/tickets/ticketSlice';
import serviceReducer from '../services/service/serviceSlice';
import articleReducer from '../services/article/articleSlice';
import noteReducer from '../services/note/noteSlice';

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  tickets: ticketReducer,
  service: serviceReducer,
  note: noteReducer,
  article: articleReducer,
  // Ajoutez d'autres réducteurs ici si nécessaire
});

// Définir le type RootState
export type RootState = ReturnType<typeof rootReducer>;

// Configure store with combined reducers
export const store = configureStore({
  reducer: rootReducer,
});
