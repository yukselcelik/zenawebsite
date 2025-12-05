// API service functions for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5133';

class ApiService {
  // Get auth token from localStorage
  static getToken() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('employeeToken');
      if (!token) return null;

      // Token süresi dolmuş mu kontrol et
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);
        const expMs = (payload?.exp || 0) * 1000;
        if (Date.now() >= expMs) {
          // Süresi dolduysa localStorage temizle
          localStorage.removeItem('employeeToken');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userName');
          return null;
        }
      } catch {
        // Parse hatasında geçersiz tokenı temizle
        localStorage.removeItem('employeeToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        return null;
      }

      return token;
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

  // Network hatalarını yakala ve Türkçe mesaj döndür
  static handleNetworkError(error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.');
    }
    if (error.name === 'NetworkError' || error.message.includes('NetworkError')) {
      throw new Error('Ağ hatası oluştu. İnternet bağlantınızı kontrol edin ve tekrar deneyin.');
    }
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.');
    }
    // Diğer hataları olduğu gibi fırlat
    throw error;
  }

  // Handle API response
  static async handleResponse(response) {
    // Response'u text olarak oku (sadece bir kez)
    const text = await response.text();
    
    // Boş response kontrolü
    if (!text || text.trim() === '') {
      if (!response.ok) {
        throw new Error('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      }
      throw new Error('Sunucudan yanıt alınamadı');
    }

    // JSON parse et
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      // JSON parse hatası - sadece console'a logla, kullanıcıya genel mesaj göster
      console.error('JSON Parse Hatası:', parseError);
      console.error('Sunucu Yanıtı (full):', text);
      console.error('Response URL:', response.url);
      
      // HTML hata sayfası mı kontrol et
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        throw new Error('Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.');
      }
      
      // Kullanıcıya genel hata mesajı göster
      throw new Error('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
    
    // Response başarılı değilse veya data.success false ise hata fırlat
    if (!response.ok) {
      // Backend'den gelen mesajı kontrol et, yoksa genel mesaj göster
      const errorMessage = data?.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
      throw new Error(errorMessage);
    }
    
    if (data.success === false) {
      // Backend'den gelen mesajı kontrol et, yoksa genel mesaj göster
      const errorMessage = data?.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
      throw new Error(errorMessage);
    }
    
    return data;
  }

  // Authentication API calls
  static async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify({ email, password }),
      });

      return this.handleResponse(response);
    } catch (error) {
      this.handleNetworkError(error);
    }
  }

  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify(userData),
      });

      return this.handleResponse(response);
    } catch (error) {
      this.handleNetworkError(error);
    }
  }

  static async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      this.handleNetworkError(error);
    }
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

      const response = await fetch(`${API_BASE_URL}/api/leave/request`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(leaveData),
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

  static async updateLeaveStatus(id, status) {
    const response = await fetch(`${API_BASE_URL}/api/leave/${id}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
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

  static async submitInternshipApplication(applicationData, cvFile = null) {
    try {
      const formData = new FormData();

      if (applicationData?.fullName) formData.append('FullName', applicationData.fullName);
      if (applicationData?.email) formData.append('Email', applicationData.email);
      if (applicationData?.phone) formData.append('Phone', applicationData.phone);
      if (applicationData?.school !== undefined) formData.append('School', applicationData.school || '');
      if (applicationData?.department !== undefined) formData.append('Department', applicationData.department || '');
      if (applicationData?.year !== undefined) formData.append('Year', applicationData.year || '');
      if (applicationData?.message !== undefined) formData.append('Message', applicationData.message || '');
      if (cvFile) {
        formData.append('CvFile', cvFile);
      }

      const headers = {};

      const response = await fetch(`${API_BASE_URL}/api/internship/apply`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      return this.handleResponse(response);
    } catch (error) {
      this.handleNetworkError(error);
    }
  }

  static async downloadInternshipCv(applicationId, originalFileName = null) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/internship/${applicationId}/cv`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('CV dosyası indirilemedi');
    }

    const contentDisposition = response.headers.get('content-disposition');
    let fileName = originalFileName || `cv_${applicationId}.pdf`;
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (fileNameMatch) {
        fileName = fileNameMatch[1];
      }
    }

    const blob = await response.blob();

    // Modern tarayıcılarda showSaveFilePicker API'sini kullan
    if ('showSaveFilePicker' in window) {
      try {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: 'CV Dosyası',
              accept: {
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
              },
            },
          ],
        });

        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (error) {
        // Kullanıcı dialog'u iptal ettiyse veya hata oluştuysa
        if (error.name !== 'AbortError') {
          console.error('File picker error:', error);
          // Fallback olarak eski yönteme geç
        } else {
          // Kullanıcı iptal etti, sessizce çık
          throw new Error('İndirme iptal edildi');
        }
      }
    }

    // Fallback: Eski tarayıcılar için otomatik indirme
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  static async getAllInternshipApplications(pageNumber = 1, pageSize = 10) {
    const response = await fetch(`${API_BASE_URL}/api/internship/applications?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async getPendingUsers(pageNumber = 1, pageSize = 10) {
    const response = await fetch(`${API_BASE_URL}/api/auth/pending-users?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async getAllPersonnelUsers(pageNumber = 1, pageSize = 10) {
    const response = await fetch(`${API_BASE_URL}/api/auth/users?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
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

  static async updateUserApprovalStatus(userId, isApproved) {
    const response = await fetch(`${API_BASE_URL}/api/auth/update-user-approval/${userId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ isApproved }),
    });

    return this.handleResponse(response);
  }

  static async deleteUser(userId) {
    const response = await fetch(`${API_BASE_URL}/api/auth/delete-user/${userId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async getUserDetail(userId) {
    const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }


  static async updateUser(userId, userData) {
    const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    return this.handleResponse(response);
  }

  static async uploadProfilePhoto(userId, file) {
    const token = this.getToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch(`${API_BASE_URL}/api/user/${userId}/photo`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return this.handleResponse(response);
  }

  static async deleteProfilePhoto(userId) {
    const response = await fetch(`${API_BASE_URL}/api/user/${userId}/photo`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  static async getPersonnelList(pageNumber = 1, pageSize = 10) {
    const response = await fetch(`${API_BASE_URL}/api/user/personnel?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async createEmploymentInfo(employmentData) {
    const response = await fetch(`${API_BASE_URL}/api/user/employment-info`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(employmentData),
    });

    return this.handleResponse(response);
  }

  static async updateEmploymentInfo(employmentInfoId, employmentData) {
    const response = await fetch(`${API_BASE_URL}/api/user/employment-info/${employmentInfoId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(employmentData),
    });

    return this.handleResponse(response);
  }

  static async deleteEmploymentInfo(employmentInfoId) {
    const response = await fetch(`${API_BASE_URL}/api/user/employment-info/${employmentInfoId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Social Security API calls
  static async getSocialSecurity(userId) {
    const response = await fetch(`${API_BASE_URL}/api/user/${userId}/social-security`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async createOrUpdateSocialSecurity(data) {
    const response = await fetch(`${API_BASE_URL}/api/user/social-security`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  static async uploadSocialSecurityDocument(userId, documentType, file) {
    const token = this.getToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('documentType', documentType.toString());
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/user/social-security/document`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse(response);
  }

  static async deleteSocialSecurityDocument(documentId) {
    const response = await fetch(`${API_BASE_URL}/api/user/social-security/document/${documentId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async downloadSocialSecurityDocument(documentId) {
    const token = this.getToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/user/social-security/document/${documentId}/download`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Dosya indirilemedi');
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get('Content-Disposition');
    let fileName = `document_${documentId}`;
    
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1].replace(/"/g, '');
      }
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  static async getLegalDocuments(userId) {
    const response = await fetch(`${API_BASE_URL}/api/user/${userId}/legal-documents`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async uploadLegalDocument(userId, documentType, file) {
    const token = this.getToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('legalDocumentType', documentType.toString());
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/user/legal-documents/document`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse(response);
  }

  static async deleteLegalDocument(documentId) {
    const response = await fetch(`${API_BASE_URL}/api/user/legal-documents/document/${documentId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  static async downloadLegalDocument(documentId) {
    const token = this.getToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/user/legal-documents/document/${documentId}/download`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Dosya indirilemedi');
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get('Content-Disposition');
    let fileName = `document_${documentId}`;
    
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1].replace(/"/g, '');
      }
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export default ApiService;