import User from '../../Users/users/userTypes/user';
import Product from '../../Products/ProductTypesAndClasses/product.entity';
import {Material} from '../../materials/MaterialsMainComponent/material';
import OrderDetails from './orderDetail';

export class CreateOrderDto {
  businessPartner: User;
  product: Product;
  productMaterial: Material;
  creator: User;
  orderDetails: OrderDetails;
  index: string;
  orderName: string;
  commentToOrder: string;
  data: string;
  orderNumber: number;  // it is not id because it is the same for orders with the same order version register
  orderVersionNumber: string;
  orderTotalNumber: string; // newOrderNumber and version number with some separator
}
