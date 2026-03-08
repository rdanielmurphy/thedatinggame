import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        const { data } = await api.getProfile();
        setUser(data.user);
        connectSocket(storedToken);
      }
    } catch {
      await AsyncStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    const { data } = await api.login({ email, password });
    await AsyncStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    connectSocket(data.token);
  };

  const signUp = async (email, password, name) => {
    const { data } = await api.register({ email, password, name });
    await AsyncStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    connectSocket(data.token);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('token');
    disconnectSocket();
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await api.getProfile();
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
