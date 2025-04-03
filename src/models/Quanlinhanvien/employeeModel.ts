import { useState, useCallback } from 'react';
import { message } from 'antd';
import { employeeService } from '@/services/QuanliNhanvien/employeeService';
import { Employee } from './types';

const generateRandomNumbers = (length: number): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
};

const generateUniqueId = (existingIds: Set<string>): string => {
  let id: string;
  do {
    id = `NV${generateRandomNumbers(8)}`;
  } while (existingIds.has(id));
  return id;
};

export default function useEmployeeModel() {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    return employeeService.getAll();
  });

  const addEmployee = useCallback((employee: Omit<Employee, 'id'>) => {
    try {
      const existingIds = new Set(employees.map(emp => emp.id));
      const newId = generateUniqueId(existingIds);

      const newEmployee: Employee = {
        ...employee,
        id: newId
      };

      const updated = [...employees, newEmployee];
      employeeService.save(updated);
      setEmployees(updated);
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm nhân viên');
      throw error;
    }
  }, [employees]);

  const updateEmployee = useCallback((id: string, employee: Omit<Employee, 'id'>) => {
    try {
      const updated = employees.map(emp =>
        emp.id === id ? { ...employee, id } : emp
      );
      employeeService.save(updated);
      setEmployees(updated);
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin nhân viên');
      throw error;
    }
  }, [employees]);

  const deleteEmployee = useCallback((id: string) => {
    try {
      const updated = employees.filter(emp => emp.id !== id);
      employeeService.save(updated);
      setEmployees(updated);
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa nhân viên');
      throw error;
    }
  }, [employees]);

  return {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee
  };
}
