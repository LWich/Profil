// src/api/auth.js

import axiosInstance from './axiosInstance';

export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post('admin/login/', {
      username: username,
      password: password,
    });
    // Assuming the response contains the token
    const { token } = response.data;
    localStorage.setItem('authToken', token);
    return token;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};
