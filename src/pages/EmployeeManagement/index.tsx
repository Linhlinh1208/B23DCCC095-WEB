import React, { useState } from 'react';
import { Table, Button, Space, Input, Select, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import EmployeeForm from '@/components/Quanlinhanvien/EmployeeForm';
import { useModel } from 'umi';
import { Employee, Position, Department, EmployeeStatus } from '@/models/Quanlinhanvien/types';

const { Search } = Input;
const { Option } = Select;

const EmployeeManagement: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useModel('Quanlinhanvien.employeeModel');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  const [searchText, setSearchText] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');

  const handleAdd = () => {
    setEditingEmployee(undefined);
    setIsModalVisible(true);
  };

  const handleEdit = (record: Employee) => {
    setEditingEmployee(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record: Employee) => {
    if (record.status !== EmployeeStatus.PROBATION && record.status !== EmployeeStatus.RESIGNED) {
      message.error('Chỉ có thể xóa nhân viên đang thử việc hoặc đã thôi việc');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa nhân viên này?',
      onOk: () => {
        try {
          deleteEmployee(record.id);
        } catch (error) {
          message.error('Có lỗi xảy ra khi xóa nhân viên');
        }
      },
    });
  };

  const handleSubmit = (values: Omit<Employee, 'id'>) => {
    try {
      if (editingEmployee) {
        updateEmployee(editingEmployee.id, values);
      } else {
        addEmployee(values);
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu thông tin nhân viên');
    }
  };

  const columns = [
    {
      title: 'Mã nhân viên',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Lương',
      dataIndex: 'salary',
      key: 'salary',
      render: (salary: number) => `${salary.toLocaleString('vi-VN')} VNĐ`,
      sorter: (a: Employee, b: Employee) => a.salary - b.salary,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Employee) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const filteredEmployees = employees
    .filter((emp: Employee) => {
      const matchesSearch = searchText === '' ||
        emp.id.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesPosition = positionFilter === '' || emp.position === positionFilter;
      const matchesDepartment = departmentFilter === '' || emp.department === departmentFilter;
      return matchesSearch && matchesPosition && matchesDepartment;
    })
    .sort((a: Employee, b: Employee) => b.salary - a.salary);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm nhân viên
          </Button>
          <Search
            placeholder="Tìm kiếm theo mã hoặc tên"
            allowClear
            onSearch={value => setSearchText(value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Lọc theo chức vụ"
            allowClear
            style={{ width: 200 }}
            onChange={value => setPositionFilter(value)}
          >
            {Object.values(Position).map(pos => (
              <Option key={pos} value={pos}>{pos}</Option>
            ))}
          </Select>
          <Select
            placeholder="Lọc theo phòng ban"
            allowClear
            style={{ width: 200 }}
            onChange={value => setDepartmentFilter(value)}
          >
            {Object.values(Department).map(dept => (
              <Option key={dept} value={dept}>{dept}</Option>
            ))}
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredEmployees}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <EmployeeForm
          initialValues={editingEmployee}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default EmployeeManagement;
