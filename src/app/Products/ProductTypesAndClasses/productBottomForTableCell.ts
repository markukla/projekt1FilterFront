import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import Product from './product.entity';
import ProductType from './productType.entity';
import {ProductForTableCell} from './productForTableCell';
import {ProductTypeForTableCell} from './productTypeForTableCell';

export class ProductBottomForTableCell {
  public id?: number;
  localizedNameInSelectedLanguage: string;
  code: string;
  productsWithThisBottom?: Product[];
  productTypesWithThisBottom?: ProductType[];
}


