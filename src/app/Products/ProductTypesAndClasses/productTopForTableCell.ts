import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import Product from './product.entity';
import ProductType from './productType.entity';
import {ProductTypeForTableCell} from './productTypeForTableCell';

export class ProductTopForTableCell {
  public id?: number;
  localizedNameInSelectedLanguage: string;
  code: string;
  productsWithThisTop?: Product[];
  productTypeswithThisTop?: ProductType[];

}


