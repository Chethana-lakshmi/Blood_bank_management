import api from './api'

export const hospitalService = {
  getAllHospitals: (params) => api.get('/hospitals', { params }),
  getHospitalById: (id) => api.get(`/hospitals/${id}`),
  updateHospital: (id, data) => api.put(`/hospitals/${id}`, data),
  getMyProfile: () => api.get('/hospitals/me'),
  updateMyProfile: (data) => api.put('/hospitals/me', data),
  verifyHospital: (id) => api.put(`/hospitals/${id}/verify`),
  rejectHospital: (id) => api.put(`/hospitals/${id}/reject`),
  deleteHospital: (id) => api.delete(`/hospitals/${id}`),
}

export default hospitalService
