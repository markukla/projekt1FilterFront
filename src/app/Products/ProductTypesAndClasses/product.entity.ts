import ProductType from './productType.entity';
import ProductBottom from './productBottom.entity';
import ProductTop from './productTop.entity';
import DimensionTextFIeldInfo from './dimensionTextFIeldInfo';


class Product{
    public id?: number;
   productType: ProductType;
    productBottom: ProductBottom;
    productTop: ProductTop;
    dimensionsCodes: string; // all dimensions separeted by coma
    urlOfOrginalDrawing: string;
    urlOfThumbnailDrawing: string; // smaller drawing obtained by library
    dimensionsTextFieldInfo: DimensionTextFIeldInfo[];
}

export default Product;
