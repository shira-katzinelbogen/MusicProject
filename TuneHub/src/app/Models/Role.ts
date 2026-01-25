export enum ERole {
    ROLE_USER = 'ROLE_USER',
    ROLE_ADMIN = 'ROLE_ADMIN',
    ROLE_SUPER_ADMIN = 'ROLE_SUPER_ADMIN',
}

export default class Role {
  id?: number;
  name?: ERole;
}