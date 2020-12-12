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
}
