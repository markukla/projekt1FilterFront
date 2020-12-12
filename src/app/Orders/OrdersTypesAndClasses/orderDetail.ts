import WorkingSideEnum from './workingSideEnum';
import Dimension from './dimension';
import Order from './orderEntity';

class OrderDetails {
  public id?: number;
  workingTemperature: number;
  antiEelectrostatic: boolean;
  workingSide: WorkingSideEnum;
  dimensions: Dimension[];
  order?: Order;



}
export default OrderDetails;
