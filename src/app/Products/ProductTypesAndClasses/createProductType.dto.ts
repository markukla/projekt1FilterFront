import ProductTop from './productTop.entity';
import ProductBottom from './productBottom.entity';
import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';

class CreateProductTypeDto {
  localizedNames: LocalizedName [];
  code: string;
  topsForThisProductType: ProductTop[]| any[];  // insteed of using whole objects we nan use id of each product type eg [{"id"=1},{"id=2"}]
  bottomsForThisProductType: ProductBottom[]| any[];
}

export default CreateProductTypeDto;
