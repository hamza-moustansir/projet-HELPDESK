import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:5000/api/notes/';

interface Note {
  _id: string;
  email: string;
  service: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NoteResponse extends Note {}

interface CreateNoteData {
  email: string;
  service: string;
  content: string;
}

// Get list of Notes
const getNotes = async (token: string): Promise<NoteResponse[]> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response: AxiosResponse<NoteResponse[]> = await axios.get(API_URL, config);
  return response.data;
};

// Create a new Note
const createNote = async (noteData: CreateNoteData, ): Promise<NoteResponse> => {
  
  const response: AxiosResponse<NoteResponse> = await axios.post(API_URL, noteData);
  return response.data;
};

// Delete a Note
const deleteNote = async (id: string, token: string): Promise<void> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  await axios.delete(`${API_URL}${id}`, config);
};

const noteService = {
  getNotes,
  createNote,
  deleteNote,
};

export default noteService;
