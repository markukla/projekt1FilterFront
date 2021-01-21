import Product from './product.entity';
import ProductType from './productType.entity';
import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';

class ProductTop {
  public id?: number;
  localizedNames: LocalizedName [];
  code: string;
  productsWithThisTop?: Product[];
  productTypeswithThisTop?: ProductType[];

}

export default ProductTop;
