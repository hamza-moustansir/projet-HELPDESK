import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:5000/api/services/';

interface ResponsibleAgent {
  _id: string;
  name: string;
  email: string;
}

interface Service {
  _id: string;
  name: string;
  responsibleAgent: ResponsibleAgent;
  createdAt?: string;
  updatedAt?: string;
}

interface ServiceResponse extends Service {}

interface CreateServiceData {
  name: string;
  responsibleAgent: string;
}

interface UpdateServiceData {
  name?: string;
  responsibleAgent?: string;
}

// Get list of services
const getServices = async (): Promise<ServiceResponse[]> => {
  
  const response: AxiosResponse<ServiceResponse[]> = await axios.get(API_URL);
  return response.data;
};

// Get service details
const getServiceDetails = async (id: string): Promise<ServiceResponse> => {
  const response: AxiosResponse<ServiceResponse> = await axios.get(`${API_URL}${id}`);
  return response.data;
};

// Create a new service
const createService = async (serviceData: CreateServiceData, token: string): Promise<ServiceResponse> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response: AxiosResponse<ServiceResponse> = await axios.post(API_URL, serviceData, config);
  return response.data;
};

// Update a service
const updateService = async (id: string, serviceData: UpdateServiceData, token: string): Promise<ServiceResponse> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response: AxiosResponse<ServiceResponse> = await axios.put(`${API_URL}${id}`, serviceData, config);
  return response.data;
};

// Delete a service
const deleteService = async (id: string, token: string): Promise<void> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  await axios.delete(`${API_URL}${id}`, config);
};

const serviceService = {
  getServices,
  getServiceDetails,
  createService,
  updateService,
  deleteService,
};

export default serviceService;
