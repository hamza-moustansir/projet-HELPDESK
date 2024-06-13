import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ticketService from './ticketService';
import { extractErrorMessage } from '../../utils';
import { RootState } from '../../redux/store';


interface ChatMessage {
  _id: string;
  ticket: string;
  sender: {
    _id: string;
    name: string;
  };
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface Ticket {
  _id: string;
  // Définissez la structure d'un ticket si nécessaire
}

interface TicketState {
  tickets: Ticket[] | null;
  ticket: Ticket | null;
  chatMessages: ChatMessage[] | null;
}

const initialState: TicketState = {
  tickets: null,
  ticket: null,
  chatMessages: null,
};

export const createTicket = createAsyncThunk(
  'tickets/create',
  async (ticketData: any, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).auth.user?.token;
      if (!token) throw new Error('User token is missing');
      return await ticketService.createTicket(ticketData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const getTickets = createAsyncThunk(
  'tickets/getAll',
  async (_, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).auth.user?.token;
      if (!token) throw new Error('User token is missing');
      return await ticketService.getTickets(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const getTicket = createAsyncThunk(
  'tickets/get',
  async (ticketId: string, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).auth.user?.token;
      if (!token) throw new Error('User token is missing');
      return await ticketService.getTicket(ticketId, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const closeTicket = createAsyncThunk(
  'tickets/close',
  async (ticketId: string, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).auth.user?.token;
      if (!token) throw new Error('User token is missing');
      return await ticketService.closeTicket(ticketId, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const updateTicketDescription = createAsyncThunk(
  'tickets/updateDescription',
  async ({ ticketId, description }: { ticketId: string, description: string }, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).auth.user?.token;
      if (!token) throw new Error('User token is missing');
      return await ticketService.updateTicketDescription(ticketId, description, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Ajoutez la nouvelle action pour obtenir les tickets par agent
export const getTicketsByAgent = createAsyncThunk(
  'tickets/getByAgent',
  async (_, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).auth.user?.token;
      if (!token) throw new Error('User token is missing');
      return await ticketService.getTicketsByAgent(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Actions asynchrones pour obtenir les messages de chat et envoyer un message
export const getChatMessages = createAsyncThunk(
  'tickets/getChatMessages',
  async (ticketId: string, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).auth.user?.token;
      if (!token) throw new Error('User token is missing');
      return await ticketService.getChatMessages(ticketId, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  'tickets/sendChatMessage',
  async ({ ticketId, message }: { ticketId: string; message: string }, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as RootState).auth.user?.token;
      if (!token) throw new Error('User token is missing');
      return await ticketService.sendChatMessage(ticketId, message, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(createTicket.pending, (state) => {
      state.ticket = null;
    })
    .addCase(createTicket.fulfilled, (state, action) => {
      state.ticket = action.payload;
      state.tickets = [...state.tickets, action.payload]
    })
      .addCase(getTickets.pending, (state) => {
        state.ticket = null;
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.tickets = action.payload;
      })
      .addCase(getTicket.fulfilled, (state, action) => {
        state.ticket = action.payload;
      })
      .addCase(updateTicketDescription.fulfilled, (state, action) => {
        state.ticket = action.payload;
      })
      .addCase(closeTicket.fulfilled, (state, action) => {
        state.ticket = action.payload;
        if (state.tickets) {
          state.tickets = state.tickets.map((ticket) =>
            ticket._id === action.payload._id ? action.payload : ticket
          );
        }
      })
      // Ajoutez les cas pour getTicketsByAgent
      .addCase(getTicketsByAgent.pending, (state) => {
        state.ticket = null;
      })
      .addCase(getTicketsByAgent.fulfilled, (state, action) => {
        state.tickets = action.payload;
      })
      .addCase(getChatMessages.fulfilled, (state, action: PayloadAction<ChatMessage[]>) => {
        state.chatMessages = action.payload;
      })
      .addCase(sendChatMessage.fulfilled, (state, action: PayloadAction<ChatMessage>) => {
        if (state.chatMessages) {
          state.chatMessages.push(action.payload);
        } else {
          state.chatMessages = [action.payload];
        }
      });
  },
});

export default ticketSlice.reducer;
