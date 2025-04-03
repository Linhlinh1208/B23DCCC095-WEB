import React, { useState } from 'react';
import { Table, Button, Space, Input, Select, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import EmployeeForm from '@/components/Quanlinhanvien/EmployeeForm';
import { useModel } from 'umi';
import { Employee, Position, Department, EmployeeStatus } from '@/models/Quanlinhanvien/types';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

const EmployeeManagement: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useModel('Quanlinhanvien.employeeModel');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();
  const [searchText, setSearchText] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getNextId = () => {
    return employees.length > 0 ? Math.max(...employees.map(emp => Number(emp.id))) + 1 : 1;
  };

  const handleAdd = () => {
    setSelectedEmployee(undefined);
    setIsModalVisible(true);
  };

  const handleEdit = (record: Employee) => {
    setSelectedEmployee(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record: Employee) => {
    if (record.status === EmployeeStatus.ACTIVE) {
      message.error('Không thể xóa nhân viên đang hoạt động');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa nhân viên này?',
      onOk: () => {
        setLoading(true);
        try {
          deleteEmployee(record.id);
          message.success('Xóa nhân viên thành công');
        } catch (error) {
          message.error('Xóa nhân viên thất bại');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSubmit = (values: Omit<Employee, 'id'>) => {
    setLoading(true);
    try {
      if (selectedEmployee) {
        updateEmployee(selectedEmployee.id, values);
        message.success('Cập nhật nhân viên thành công');
      } else {
        addEmployee(values);
        message.success('Thêm nhân viên thành công');
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error(selectedEmployee ? 'Cập nhật nhân viên thất bại' : 'Thêm nhân viên thất bại');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Employee> = [
    {
      title: 'Mã nhân viên',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => Number(a.id) - Number(b.id),
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      key: 'position',
      filters: Object.values(Position).map((pos) => ({ text: pos, value: pos })),
      onFilter: (value, record) => record.position === value,
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
      filters: Object.values(Department).map((dept) => ({ text: dept, value: dept })),
      onFilter: (value, record) => record.department === value,
    },
    {
      title: 'Lương',
      dataIndex: 'salary',
      key: 'salary',
      sorter: (a, b) => a.salary - b.salary,
      render: (salary: number) => `${salary.toLocaleString()} VNĐ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: Object.values(EmployeeStatus).map((status) => ({ text: status, value: status })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.id.toString().includes(searchText) ||
      employee.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesPosition = selectedPosition ? employee.position === selectedPosition : true;
    const matchesDepartment = selectedDepartment ? employee.department === selectedDepartment : true;
    return matchesSearch && matchesPosition && matchesDepartment;
  });

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="Tìm kiếm theo mã hoặc tên"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          <Select
            placeholder="Chọn chức vụ"
            style={{ width: 200 }}
            allowClear
            onChange={setSelectedPosition}
            value={selectedPosition}
          >
            {Object.values(Position).map((pos) => (
              <Option key={pos} value={pos}>
                {pos}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Chọn phòng ban"
            style={{ width: 200 }}
            allowClear
            onChange={setSelectedDepartment}
            value={selectedDepartment}
          >
            {Object.values(Department).map((dept) => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            ))}
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm nhân viên
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredEmployees}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={selectedEmployee ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <EmployeeForm
          initialValues={selectedEmployee}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalVisible(false)}
          nextId={getNextId()}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default EmployeeManagement;
