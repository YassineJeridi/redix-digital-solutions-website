import api from './api';

const API_URL = '/api/projects';

// Get all projects with filters, search, sort, and pagination
export const getProjects = async (params = {}) => {
    const response = await api.get(API_URL, { params });
    return response.data;
};

// Get single project by ID
export const getProjectById = async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
};

// Create new project
export const createProject = async (projectData) => {
    const response = await api.post(API_URL, projectData);
    return response.data;
};

// Update project
export const updateProject = async (id, projectData) => {
    const response = await api.put(`${API_URL}/${id}`, projectData);
    return response.data;
};

// Delete project
export const deleteProject = async (id, confirmName) => {
    const response = await api.delete(`${API_URL}/${id}`, {
        data: { confirmName }
    });
    return response.data;
};

// Add note to project
export const addNote = async (id, content) => {
    const response = await api.post(`${API_URL}/${id}/notes`, { content });
    return response.data;
};

// Add attachment to project
export const addAttachment = async (id, attachmentData) => {
    const response = await api.post(`${API_URL}/${id}/attachments`, attachmentData);
    return response.data;
};

// Export to CSV
export const exportToCSV = async (filters = {}) => {
    const response = await api.get(`${API_URL}/export/csv`, {
        params: filters,
        responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `projects-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};

// Export to PDF
export const exportToPDF = async (filters = {}) => {
    const response = await api.get(`${API_URL}/export/pdf`, {
        params: filters,
        responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `projects-${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};

// Get project statistics
export const getProjectStats = async () => {
    const response = await api.get(`${API_URL}/stats`);
    return response.data;
};

// Inline status update (payment or project status)
export const updateProjectStatus = async (id, statusData) => {
    const response = await api.patch(`${API_URL}/${id}/status`, statusData);
    return response.data;
};

// Record a partial payment
export const recordPartialPayment = async (id, amount) => {
    const response = await api.post(`${API_URL}/${id}/partial-payment`, { amount });
    return response.data;
};
