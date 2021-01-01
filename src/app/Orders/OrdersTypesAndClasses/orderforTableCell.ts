import User from '../../Users/users/userTypes/user';
import Product from '../../Products/ProductTypesAndClasses/product.entity';
import {Material} from '../../materials/MaterialsMainComponent/material';
import OrderDetails from './orderDetail';
import OrderVersionRegister from './orderVersionRegister';

class OrderforTableCell {
  public id?: number;
  orderNumber: string;  // it is not id because it is the same for orders with the same order version register
  orderVersionNumber: string;
  orderTotalNumber: string; // newOrderNumber and version number with some separator
  index: string;
  data: string;
  orderName: string;
  businessPartnerFulname: string;
  businessPartnerCode: string;
  businessPartnerCompanyName: string;
  businessPartnerEmail: string;
  orderVersionRegisterId: number;
}


export default OrderforTableCell;
