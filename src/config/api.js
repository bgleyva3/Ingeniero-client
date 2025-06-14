// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Products
  products: {
    getAll: `${API_BASE_URL}/api/products`,
    getById: (id) => `${API_BASE_URL}/api/products/${id}`,
    getBySku: `${API_BASE_URL}/api/products/by-sku/`,
    create: `${API_BASE_URL}/api/products`,
    update: (id) => `${API_BASE_URL}/api/products/${id}`,
    delete: (id) => `${API_BASE_URL}/api/products/${id}`,
  },
  // Agent
  agent: {
    query: `${API_BASE_URL}/api/agent/query`,
  },
  // Utils
  utils: {
    splitMessage: `${API_BASE_URL}/api/utils/split-agent-message`,
  },
  // RAG
  rag: {
    query: `${API_BASE_URL}/rag`,
  },
}; 