import ProductTop from './productTop.entity';
import ProductBottom from './productBottom.entity';

class CreateProductTypeDto{
  name: string;
  code: string;
    topsForThisProductType: ProductTop[];  // insteed of using whole objects we nan use id of each product type eg [{"id"=1},{"id=2"}]
    bottomsForThisProductType: ProductBottom[];
}
export default CreateProductTypeDto;
