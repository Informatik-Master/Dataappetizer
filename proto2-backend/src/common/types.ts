export enum Role {
  Admin = 'admin',
  User = 'user',
}

export interface User {
  username: string;
  password: string;
  systems: string[];
  role: Role;
}
