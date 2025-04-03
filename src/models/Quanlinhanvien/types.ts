export enum EmployeeStatus {
  PROBATION = 'Thử việc',
  ACTIVE = 'Đang làm việc',
  ON_LEAVE = 'Nghỉ phép',
  RESIGNED = 'Đã thôi việc'
}

export enum Position {
  INTERN = 'Thực tập sinh',
  STAFF = 'Nhân viên',
  SENIOR = 'Chuyên viên cao cấp',
  LEADER = 'Trưởng nhóm',
  MANAGER = 'Quản lý',
  DIRECTOR = 'Giám đốc'
}

export enum Department {
  IT = 'Công nghệ thông tin',
  HR = 'Nhân sự',
  FINANCE = 'Tài chính',
  MARKETING = 'Marketing',
  SALES = 'Kinh doanh',
  OPERATIONS = 'Vận hành'
}

export interface Employee {
  id: string;
  name: string;
  position: Position;
  department: Department;
  salary: number;
  status: EmployeeStatus;
}
