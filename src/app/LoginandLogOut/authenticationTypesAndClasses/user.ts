import Role from './role';

class User {

  public id?: number;

  fulName: string;


  email: string;

  password: string;

  active: boolean;


  code?: string;

  businesPartnerCompanyName?: string;

  roles: Role[];
}

export default User;
