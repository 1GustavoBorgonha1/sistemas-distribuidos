import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  totalQty: number;
  availableQty: number;
}

export interface Loan {
  _id: string;
  userId: string | User;
  bookId: string | Book;
  borrowedAt: string;
  returnedAt?: string;
  status: 'active' | 'returned';
}

export const authApi = {
  register: (data: { name: string; email: string; password: string; adminSecret?: string }) =>
    api.post<{ token: string; user: User }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; user: User }>('/auth/login', data),
};

export const booksApi = {
  list: (q?: string) => api.get<Book[]>('/books', { params: q ? { q } : {} }),
  get: (id: string) => api.get<Book>(`/books/${id}`),
  create: (data: { title: string; author: string; isbn: string; totalQty: number }) =>
    api.post<Book>('/books', data),
  update: (id: string, data: Partial<Book>) => api.put<Book>(`/books/${id}`, data),
};

export const loansApi = {
  borrow: (bookId: string) => api.post<Loan>('/loans', { bookId }),
  returnBook: (loanId: string) => api.put<Loan>(`/loans/${loanId}/return`),
  myLoans: () => api.get<Loan[]>('/loans/my'),
  allLoans: () => api.get<Loan[]>('/loans'),
};

export default api;
