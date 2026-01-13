import { api } from './api';

// Generic base service that can be extended for any entity
export class BaseService<T> {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Get item by ID
  async getById(id: number | string): Promise<T> {
    return api.get<T>(`${this.baseUrl}/${id}`);
  }

  // Create new item
  async create(data: Omit<T, 'id'>): Promise<T> {
    return api.post<T>(this.baseUrl, data);
  }

  // Update item
  async update(id: number | string, data: Partial<T>): Promise<T> {
    return api.put<T>(`${this.baseUrl}/${id}`, data);
  }

  // Delete item
  async delete(id: number | string): Promise<void> {
    return api.delete(`${this.baseUrl}/${id}`);
  }

  // Patch item (partial update)
  async patch(id: number | string, data: Partial<T>): Promise<T> {
    return api.patch<T>(`${this.baseUrl}/${id}`, data);
  }
}