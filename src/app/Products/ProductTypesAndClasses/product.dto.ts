import DimensionTextFIeldInfo from './dimensionTextFIeldInfo';
import ProductType from './productType.entity';
import ProductBottom from './productBottom.entity';
import ProductTop from './productTop.entity';

class CreateProductDto{
    productType: ProductType;
    productTop: ProductTop;
    productBottom: ProductBottom;
    dimensionsCodes: string;
    dimensionsTextFieldInfo: DimensionTextFIeldInfo[];
    urlOfOrginalDrawing: string;
    urlOfThumbnailDrawing: string;


}
export default CreateProductDto;
