import Role from './role';
import Order from '../../../Orders/OrdersTypesAndClasses/orderEntity';

class User {

  public id?: number;

  fulName: string;


  email: string;

  password: string;

  active: boolean;


  code?: string;

  businesPartnerCompanyName?: string;

  roles: Role[];
  ordersOfPartner?: Order[];
}

export default User;
