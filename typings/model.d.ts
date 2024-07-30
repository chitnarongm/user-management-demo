export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

export interface PrivateUser extends UserData {
  password: string;
}

export interface UserResponse {
  users: UserData[];
  total: number;
  offset: number;
  limit: number;
}

export interface LogInForm {
  email: string;
  password: string;
}
