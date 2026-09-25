import api from './api'

export const donationService = {
  recordDonation: (data) => api.post('/donations', data),
  getAllDonations: (params) => api.get('/donations', { params }),
  getDonationsByDonor: (donorId, params) => api.get(`/donations/donor/${donorId}`, { params }),
  getDonationById: (id) => api.get(`/donations/${id}`),
  deleteDonation: (id) => api.delete(`/donations/${id}`),
  getMyDonations: (params) => api.get('/donations/my', { params }),
  getMonthlyStats: () => api.get('/donations/stats/monthly'),
}

export default donationService
