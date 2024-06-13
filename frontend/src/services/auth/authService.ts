import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

interface UserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface ApiResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

// Register user
const register = async (userData: UserData): Promise<ApiResponse | undefined> => {
  try {
    const response = await axios.post<ApiResponse>(API_URL, userData);

    // Remove this line to prevent automatic login
    // if (response.data) {
    //   localStorage.setItem('user', JSON.stringify(response.data));
    // }

    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    return undefined;
  }
};

// Login user
const login = async (userData: UserData): Promise<ApiResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(API_URL + 'login', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

// Logout user
const logout = (): void => localStorage.removeItem('user');

// Get all users
const getUsers = async (): Promise<ApiResponse[] | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse[]> = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Delete a user
const deleteUser = async (userId: string): Promise<void> => {
  try {
    await axios.delete(API_URL + userId);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
    
// Fonction pour obtenir les statistiques des utilisateurs
const getUserStats = async () => {
  const response = await axios.get(`${API_URL}/stats`);
  return response.data;
};

// Fonction pour obtenir les statistiques des agent/ticket
const getAgentStats = async () => {
  const response = await axios.get(`${API_URL}/agentRanking`);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getUsers,
  deleteUser,
  getUserStats,
  getAgentStats,
};

export default authService;
