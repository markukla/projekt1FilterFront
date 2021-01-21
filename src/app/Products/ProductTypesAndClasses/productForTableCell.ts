import ProductType from './productType.entity';
import ProductBottom from './productBottom.entity';
import ProductTop from './productTop.entity';
import DimensionTextFIeldInfo from './dimensionTextFIeldInfo';

export class ProductForTableCell{
  public id?: number;
  productTypeNameInSelectedLanguage: string;
  productTypeCode: string;
  productBottomNameInSelectedLanguage: string;
  productBottomCode: string;
  productTopNameInSelectedLanguage: string;
  productTopCode: string;
  productBottomCodePlusNAme: string;
  productTopCodePlusName: string;
  productTypeCodePlusName: string;


}

