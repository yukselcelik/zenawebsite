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
    // Response'u text olarak oku (sadece bir kez)
    const text = await response.text();
    
    // Debug: Response'un ilk 500 karakterini logla
    console.log('Response text (first 500 chars):', text.substring(0, 500));
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    // Boş response kontrolü
    if (!text || text.trim() === '') {
      if (!response.ok) {
        throw new Error(`Sunucu hatası: ${response.status} ${response.statusText}`);
      }
      throw new Error('Sunucudan yanıt alınamadı');
    }

    // JSON parse et
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      // JSON parse hatası - response'un tamamını logla
      console.error('JSON Parse Hatası:', parseError);
      console.error('Sunucu Yanıtı (full):', text);
      console.error('Response URL:', response.url);
      
      // HTML hata sayfası mı kontrol et
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        throw new Error(`Sunucu HTML yanıtı döndürdü. Muhtemelen backend çalışmıyor veya yanlış URL. HTTP ${response.status}`);
      }
      
      throw new Error(`Sunucu yanıtı geçersiz JSON formatı. İlk 200 karakter: ${text.substring(0, 200)}`);
    }
    
    // Response başarılı değilse veya data.success false ise hata fırlat
    if (!response.ok) {
      throw new Error(data.message || `Sunucu hatası: ${response.status} ${response.statusText}`);
    }
    
    if (data.success === false) {
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
    try {
      const headers = this.getHeaders();
      console.log('Request URL:', `${API_BASE_URL}/api/leave/request`);
      console.log('Request headers:', headers);
      console.log('Request body:', JSON.stringify(leaveData));

      const response = await fetch(`${API_BASE_URL}/api/leave/request`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(leaveData),
      });

      // Debug için response'u kontrol et
      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', {
        'content-type': response.headers.get('content-type'),
        'content-length': response.headers.get('content-length')
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  static async getMyLeaveRequests(pageNumber = 1, pageSize = 10) {
    const response = await fetch(`${API_BASE_URL}/api/leave/my-requests?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async getAllLeaveRequests(pageNumber = 1, pageSize = 10) {
    const response = await fetch(`${API_BASE_URL}/api/leave/all-requests?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
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

  // Internship application API calls
  static async submitInternshipApplication(applicationData) {
    const response = await fetch(`${API_BASE_URL}/api/internship/apply`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(applicationData),
    });

    return this.handleResponse(response);
  }

  static async getAllInternshipApplications(pageNumber = 1, pageSize = 10) {
    const response = await fetch(`${API_BASE_URL}/api/internship/applications?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // User management API calls (Manager only)
  static async getPendingUsers(pageNumber = 1, pageSize = 10) {
    const response = await fetch(`${API_BASE_URL}/api/auth/pending-users?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async approveUser(userId) {
    const response = await fetch(`${API_BASE_URL}/api/auth/approve-user/${userId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async rejectUser(userId) {
    const response = await fetch(`${API_BASE_URL}/api/auth/reject-user/${userId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }
}

export default ApiService;