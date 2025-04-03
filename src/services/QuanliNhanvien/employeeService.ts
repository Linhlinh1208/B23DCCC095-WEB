import { Employee } from '@/models/Quanlinhanvien/types';

const STORAGE_KEY = 'employees';

export const employeeService = {
  getAll: (): Employee[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading employees:', error);
      return [];
    }
  },

  save: (data: Employee[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving employees:', error);
      throw new Error('Không thể lưu dữ liệu');
    }
  },


};
