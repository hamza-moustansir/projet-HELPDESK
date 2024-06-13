// tagService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/articles/tags'; 

const getTags = async (token: string) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const tagService = {
  getTags,
};

export default tagService;
