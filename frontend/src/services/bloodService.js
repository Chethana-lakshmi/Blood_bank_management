import api from './api'

export const bloodService = {
  getAllStock: (params) => api.get('/blood-stock', { params }),
  getStockByGroup: (group) => api.get(`/blood-stock/${encodeURIComponent(group)}`),
  updateStock: (group, data) => api.put(`/blood-stock/${encodeURIComponent(group)}`, data),
  addUnits: (group, units) => api.post(`/blood-stock/${encodeURIComponent(group)}/add`, { units }),
  removeUnits: (group, units) => api.post(`/blood-stock/${encodeURIComponent(group)}/remove`, { units }),
  getStockSummary: () => api.get('/blood-stock/summary'),
}

export default bloodService
