// Import the necessary modules
import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:5000/api/articles/';

interface Author {
  _id: string;
  name: string;
  email: string;
}

interface Article {
  _id: string;
  title: string;
  content: string;
  author: Author;
  createdAt?: string;
  updatedAt?: string;
}

interface ArticleResponse extends Article {}

interface CreateArticleData {
  title: string;
  content: string;
  author: string;
}

interface UpdateArticleData {
  title?: string;
  content?: string;
}

// Get list of Articles
const getArticles = async (token: string): Promise<ArticleResponse[]> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response: AxiosResponse<ArticleResponse[]> = await axios.get(API_URL, config);
  return response.data;
};

// Get Article details
const getArticle = async (id: string): Promise<ArticleResponse> => {
  const response: AxiosResponse<ArticleResponse> = await axios.get(`${API_URL}${id}`);
  return response.data;
};

// Create a new Article
const createArticle = async (articleData: CreateArticleData, token: string): Promise<ArticleResponse> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response: AxiosResponse<ArticleResponse> = await axios.post(API_URL, articleData, config);
  return response.data;
};

// Update an Article
const updateArticle = async (id: string, articleData: UpdateArticleData, token: string): Promise<ArticleResponse> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response: AxiosResponse<ArticleResponse> = await axios.put(`${API_URL}${id}`, articleData, config);
  return response.data;
};

// Delete an Article
const deleteArticle = async (id: string, token: string): Promise<void> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  await axios.delete(`${API_URL}${id}`, config);
};

// Search Articles
const searchArticles = async (query: string, token: string): Promise<ArticleResponse[]> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response: AxiosResponse<ArticleResponse[]> = await axios.get(`${API_URL}search/${query}`, config);
  return response.data;
};

const articleService = {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  searchArticles, // Add the searchArticles method here
};

export default articleService;
