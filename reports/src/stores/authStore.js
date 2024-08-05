// src/stores/authStore.js

import { makeAutoObservable } from 'mobx';
import { login as loginApi } from '../api/auth';

class AuthStore {
  authToken = null;

  constructor() {
    makeAutoObservable(this);
  }

  setAuthToken(token) {
    this.authToken = token;
    localStorage.setItem('authToken', token);
  }

  getAuthToken() {
    return this.authToken || localStorage.getItem('authToken');
  }

  async login(username, password) {
    try {
      const token = await loginApi(username, password);
      this.setAuthToken(token);
    } catch (error) {
      throw new Error('Login failed');
    }
  }
}

const authStore = new AuthStore();
export default authStore;
