import api from './api'

export const donorService = {
  getAllDonors: (params) => api.get('/donors', { params }),
  getDonorById: (id) => api.get(`/donors/${id}`),
  updateDonor: (id, data) => api.put(`/donors/${id}`, data),
  updateAvailability: (id, status) =>
    api.patch(`/donors/${id}/availability`, {
      availabilityStatus: typeof status === 'string' ? status : (status ? 'AVAILABLE' : 'UNAVAILABLE'),
    }),
  getDonationHistory: (id, params) => api.get(`/donors/${id}/donations`, { params }),
  getMyProfile: () => api.get('/donors/me'),
  updateMyProfile: (data) => api.put('/donors/me', data),
  searchDonors: (params) => api.get('/donors/search', { params }),
  deleteDonor: (id) => api.delete(`/donors/${id}`),
}

export default donorService
