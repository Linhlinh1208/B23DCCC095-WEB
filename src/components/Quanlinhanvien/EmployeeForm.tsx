import React, { useEffect } from 'react';
import { Form, Input, Select, InputNumber, Button, Spin } from 'antd';
import { Employee, Position, Department, EmployeeStatus } from '@/models/Quanlinhanvien/types';

interface EmployeeFormProps {
  initialValues?: Employee;
  onSubmit: (values: Omit<Employee, 'id'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
      >
        {initialValues && (
          <Form.Item
            label="Mã nhân viên"
            name="id"
          >
            <Input disabled />
          </Form.Item>
        )}

        <Form.Item
          label="Tên nhân viên"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên nhân viên' },
            { max: 50, message: 'Tên nhân viên không được vượt quá 50 ký tự' },
            { pattern: /^[a-zA-Z0-9À-ỹ\s]+$/, message: 'Tên nhân viên không được chứa ký tự đặc biệt' },
            { whitespace: true, message: 'Tên nhân viên không được chỉ chứa khoảng trắng' }
          ]}
        >
          <Input placeholder="Nhập tên nhân viên" />
        </Form.Item>

        <Form.Item
          label="Chức vụ"
          name="position"
          rules={[
            { required: true, message: 'Vui lòng chọn chức vụ' },
            { type: 'enum', enum: Object.values(Position), message: 'Chức vụ không hợp lệ' }
          ]}
        >
          <Select placeholder="Chọn chức vụ">
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
          rules={[
            { required: true, message: 'Vui lòng chọn phòng ban' },
            { type: 'enum', enum: Object.values(Department), message: 'Phòng ban không hợp lệ' }
          ]}
        >
          <Select placeholder="Chọn phòng ban">
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
          rules={[
            { required: true, message: 'Vui lòng nhập lương' }
          ]}
          getValueFromEvent={(e) => {
            const { value } = e.target;
            const rawValue = value.replace(/[^\d]/g, '');
            if (!rawValue) return '';
            const num = parseInt(rawValue, 10);
            return num;
          }}
          normalize={(value) => {
            if (!value) return '';
            const num = parseInt(value.toString(), 10);
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }}
        >
          <Input placeholder="Nhập lương (VNĐ)" />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[
            { required: true, message: 'Vui lòng chọn trạng thái' },
            { type: 'enum', enum: Object.values(EmployeeStatus), message: 'Trạng thái không hợp lệ' }
          ]}
        >
          <Select placeholder="Chọn trạng thái">
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
          <Button style={{ marginLeft: 8 }} onClick={onCancel} disabled={loading}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default EmployeeForm;
