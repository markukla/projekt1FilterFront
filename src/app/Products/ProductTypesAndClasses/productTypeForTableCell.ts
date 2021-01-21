import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import Product from './product.entity';
import ProductTop from './productTop.entity';
import ProductBottom from './productBottom.entity';
import {ProductTopForTableCell} from './productTopForTableCell';
import {ProductBottomForTableCell} from './productBottomForTableCell';

export class ProductTypeForTableCell {
  public id?: number;
  localizedNameInSelectedLanguage: string;
  code: string;
  productsWithThisType?: Product[];
  topsForThisProductType: ProductTop[];
  bottomsForThisProductType: ProductBottom[];
}


