import React from 'react';
import { Form, Input, Select, InputNumber, Button } from 'antd';
import { Employee, Position, Department, EmployeeStatus } from '@/models/Quanlinhanvien/types';

interface EmployeeFormProps {
  initialValues?: Employee;
  onSubmit: (values: Omit<Employee, 'id'>) => void;
  onCancel: () => void;
  nextId: number;
  loading?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  nextId,
  loading = false
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Mã nhân viên"
        name="id"
        initialValue={initialValues?.id || nextId}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        label="Tên nhân viên"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Chức vụ"
        name="position"
        rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}
      >
        <Select>
          {Object.values(Position).map((pos) => (
            <Select.Option key={pos} value={pos}>
              {pos}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Phòng ban"
        name="department"
        rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
      >
        <Select>
          {Object.values(Department).map((dept) => (
            <Select.Option key={dept} value={dept}>
              {dept}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Lương"
        name="salary"
        rules={[{ required: true, message: 'Vui lòng nhập lương' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
        />
      </Form.Item>

      <Form.Item
        label="Trạng thái"
        name="status"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
      >
        <Select>
          {Object.values(EmployeeStatus).map((status) => (
            <Select.Option key={status} value={status}>
              {status}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
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
