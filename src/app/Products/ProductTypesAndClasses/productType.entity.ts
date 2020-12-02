import ProductBottom from './productBottom.entity';
import ProductTop from './productTop.entity';
import Product from './product.entity';


class ProductType {
  public id?: number;
  name: string;
  code: string;
  productsWithThisType?: Product[];
  topsForThisProductType: ProductTop[];
  bottomsForThisProductType: ProductBottom[];
}

export default ProductType;


