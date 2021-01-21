import ProductBottom from './productBottom.entity';
import ProductTop from './productTop.entity';
import Product from './product.entity';
import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';


class ProductType {
  public id?: number;
  localizedNames: LocalizedName [];
  code: string;
  productsWithThisType?: Product[];
  topsForThisProductType: ProductTop[];
  bottomsForThisProductType: ProductBottom[];
}

export default ProductType;


