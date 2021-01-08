import User from '../../Users/users/userTypes/user';
import Product from '../../Products/ProductTypesAndClasses/product.entity';
import {Material} from '../../materials/MaterialsMainComponent/material';
import OrderDetails from './orderDetail';
import OrderVersionRegister from './orderVersionRegister';

class Order {
  public id?: number;
  orderNumber: number;  // it is not id because it is the same for orders with the same order version register
  orderVersionNumber: string;
  orderTotalNumber: string; // newOrderNumber and version number with some separator
  index: string;
  date: Date;
  orderName: string;
  commentToOrder?: string;
  businessPartner: User;
  product: Product;
  productMaterial: Material;
  orderDetails: OrderDetails;
  creator: User;
  orderVersionRegister: OrderVersionRegister;
}

export default Order;
