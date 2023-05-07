export enum Role {
  Admin = 'admin',
  User = 'user',
}

export interface User {
  email: string;
  password: string;
  systems: string[];
  role: Role;
}
