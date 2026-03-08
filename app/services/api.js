import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/config';

const api = axios.create({ baseURL: API_URL + '/api' });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Profile
export const getProfile = () => api.get('/profile/me');
export const updateProfile = (data) => api.put('/profile/me', data);
export const uploadPhotoBase64 = (image) => api.post('/profile/photos/base64', { image });
export const deletePhoto = (photoUrl) => api.delete('/profile/photos', { data: { photoUrl } });
export const getPublicProfile = (userId) => api.get(`/profile/${userId}`);

// Discovery
export const getFeed = (distance) => api.get(`/discovery/feed?distance=${distance || 50}`);
export const swipe = (targetId, direction) => api.post('/discovery/swipe', { targetId, direction });
export const answerQuestion = (targetId, answerIndex) => api.post('/discovery/answer', { targetId, answerIndex });

// Matches
export const getMatches = () => api.get('/matches');

// Messages
export const getConversations = () => api.get('/messages/conversations');
export const getMessages = (conversationId, page = 1) => api.get(`/messages/${conversationId}?page=${page}`);
export const sendMessage = (conversationId, text) => api.post(`/messages/${conversationId}`, { text });

export default api;
