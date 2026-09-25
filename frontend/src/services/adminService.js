import api from './api'

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStatistics: (params) => api.get('/admin/statistics', { params }),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getReports: (params) => api.get('/admin/reports', { params }),
  getMonthlyReport: (params) => api.get('/admin/reports/monthly', { params }),
  getBloodStockReport: () => api.get('/admin/reports/blood-stock'),
}

export default adminService
