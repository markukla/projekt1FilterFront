import Product from './product.entity';
import ProductType from './productType.entity';
import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';


class ProductBottom {
    public id?: number;
    localizedNames: LocalizedName [];
    code: string;
    productsWithThisBottom?: Product[];
    productTypesWithThisBottom?: ProductType[];
}

export default ProductBottom;
