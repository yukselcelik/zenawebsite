// API service functions for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5133';

class ApiService {
  // Get auth token from localStorage
  static getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('employeeToken');
    }
    return null;
  }

  // Get headers with auth token
  static getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Handle API response
  static async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'API hatası');
    }
    
    return data;
  }

  // Authentication API calls
  static async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, password }),
    });

    return this.handleResponse(response);
  }

  static async register(userData) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(userData),
    });

    return this.handleResponse(response);
  }

  static async getProfile() {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async logout() {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Leave request API calls
  static async createLeaveRequest(leaveData) {
    const response = await fetch(`${API_BASE_URL}/api/leave/request`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(leaveData),
    });

    return this.handleResponse(response);
  }

  static async getMyLeaveRequests() {
    const response = await fetch(`${API_BASE_URL}/api/leave/my-requests`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async getAllLeaveRequests() {
    const response = await fetch(`${API_BASE_URL}/api/leave/all-requests`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async getLeaveRequestById(id) {
    const response = await fetch(`${API_BASE_URL}/api/leave/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async approveLeaveRequest(id) {
    const response = await fetch(`${API_BASE_URL}/api/leave/${id}/approve`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async rejectLeaveRequest(id) {
    const response = await fetch(`${API_BASE_URL}/api/leave/${id}/reject`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async deleteLeaveRequest(id) {
    const response = await fetch(`${API_BASE_URL}/api/leave/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async getLeaveStats() {
    const response = await fetch(`${API_BASE_URL}/api/leave/my-stats`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }
}

export default ApiService;