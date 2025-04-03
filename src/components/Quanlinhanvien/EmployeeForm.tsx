import React, { useEffect } from 'react';
import { Form, Input, Select, InputNumber, Button } from 'antd';
import { Employee, Position, Department, EmployeeStatus } from '@/models/Quanlinhanvien/types';

interface EmployeeFormProps {
  initialValues?: Employee;
  onSubmit: (values: Omit<Employee, 'id'>) => void;
  onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
    >
      <Form.Item
        name="name"
        label="Họ tên"
        rules={[
          { required: true, message: 'Vui lòng nhập họ tên' },
          { max: 50, message: 'Họ tên không được vượt quá 50 ký tự' },
          { pattern: /^[a-zA-ZÀ-ỹ0-9\s]+$/, message: 'Họ tên không được chứa ký tự đặc biệt' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="position"
        label="Chức vụ"
        rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}
      >
        <Select>
          {Object.values(Position).map(pos => (
            <Select.Option key={pos} value={pos}>{pos}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="department"
        label="Phòng ban"
        rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
      >
        <Select>
          {Object.values(Department).map(dept => (
            <Select.Option key={dept} value={dept}>{dept}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="salary"
        label="Lương"
        rules={[{ required: true, message: 'Vui lòng nhập lương' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          formatter={(value: number | undefined) => {
            if (value === undefined) return '';
            return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ`;
          }}
          parser={(value: string | undefined) => {
            if (value === undefined) return 0;
            return Number(value.replace(/[^\d]/g, ''));
          }}
          min={0}
        />
      </Form.Item>

      <Form.Item
        name="status"
        label="Trạng thái"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
      >
        <Select>
          {Object.values(EmployeeStatus).map(status => (
            <Select.Option key={status} value={status}>{status}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={handleSubmit}>
          {initialValues ? 'Cập nhật' : 'Thêm mới'}
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={onCancel}>
          Hủy
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmployeeForm;
