import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:5000/api/tickets/';
const API_URLL = 'http://localhost:5000/api/tickets/update-description/';

interface Ticket {
  // Définissez la structure d'un ticket si nécessaire
}

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

// Créer un nouveau ticket
const createTicket = async (ticketData: any, token: string): Promise<Ticket> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response: AxiosResponse<Ticket> = await axios.post(API_URL, ticketData, config);

  return response.data;
};

// Obtenir les tickets de l'utilisateur
const getTickets = async (token: string): Promise<Ticket[]> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response: AxiosResponse<Ticket[]> = await axios.get(API_URL, config);

  return response.data;
};

// Obtenir un ticket utilisateur spécifique
const getTicket = async (ticketId: string, token: string): Promise<Ticket> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response: AxiosResponse<Ticket> = await axios.get(API_URL + ticketId, config);

  return response.data;
};

// Mettre à jour la description d'un ticket
const updateTicketDescription = async (
  ticketId: string,
  description: string,
  token: string
): Promise<Ticket> => {
  try {
    const response: AxiosResponse<Ticket> = await axios.put(
      API_URLL + ticketId,
      { description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fermer un ticket
const closeTicket = async (ticketId: string, token: string): Promise<Ticket> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response: AxiosResponse<Ticket> = await axios.put(
    API_URL + ticketId,
    { status: 'closed' },
    config
  );

  return response.data;
};

// Obtenir les tickets assignés à un agent
const getTicketsByAgent = async (token: string): Promise<Ticket[]> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response: AxiosResponse<Ticket[]> = await axios.get(API_URL + 'agent', config);

  return response.data;
};

const getChatMessages = async (ticketId: string, token: string): Promise<ChatMessage[]> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response: AxiosResponse<ChatMessage[]> = await axios.get(`${API_URL}${ticketId}/chats`, config);
  return response.data;
};

const sendChatMessage = async (ticketId: string, message: string, token: string): Promise<ChatMessage> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response: AxiosResponse<ChatMessage> = await axios.post(`${API_URL}${ticketId}/chats`, { message }, config);
  return response.data;
};

const getTicketStats = async (token: string) => {
  const config = {
  headers: {
        Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get('http://localhost:5000/api/tickets/statss', config); 
  return response.data;
};

const getTicketStatsByAgentAndService = async (agentId: string, serviceId: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  };

  try {
    const response = await axios.get(`http://localhost:5000/api/tickets/stats/agent/${agentId}/service/${serviceId}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getTicketStatsMois = async (token: string) => {
  const config = {
  headers: {
        Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get('http://localhost:5000/api/tickets/stats/monthly-closed', config);
  return response.data;
};

const getMonthlyTicketStatsByAgent = async (agentId: string, serviceId: string, token: string) => {
  const config = {
  headers: {
        Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`http://localhost:5000/api/tickets/stats/monthlyStatsByAgent/${agentId}/${serviceId}`, config);
  return response.data;
};

// Obtenir is Service
const getServiceByAgent = async (token: string): Promise<Ticket[]> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response: AxiosResponse<Ticket[]> = await axios.get('http://localhost:5000/api/tickets/stats/service', config);
  return response.data;
};



const ticketService = {
  createTicket,
  getTickets,
  getTicket,
  updateTicketDescription,
  closeTicket,
  getTicketsByAgent,
  getChatMessages,
  sendChatMessage,
  getTicketStats,
  getTicketStatsByAgentAndService,
  getTicketStatsMois,
  getMonthlyTicketStatsByAgent,
  getServiceByAgent,
};

export default ticketService;
