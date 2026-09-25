import api from './api'

export const requestService = {
  createRequest: (data) => api.post('/requests', data),
  getAllRequests: (params) => api.get('/requests', { params }),
  getRequestById: (id) => api.get(`/requests/${id}`),
  updateStatus: (id, status, notes) => api.put(`/requests/${id}/status`, { status, notes }),
  getHospitalRequests: (params) => api.get('/requests/my', { params }),
  deleteRequest: (id) => api.delete(`/requests/${id}`),
  getEmergencyRequests: () => api.get('/requests/emergency'),
}

export default requestService
