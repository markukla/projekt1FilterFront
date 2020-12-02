import Product from './product.entity';
import ProductType from './productType.entity';

class ProductTop {
  public id?: number;
  name: string;
  code: string;
  productsWithThisTop?: Product[];
  productTypeswithThisTop?: ProductType[];

}

export default ProductTop;
