import Product from './product.entity';
import ProductType from './productType.entity';


class ProductBottom {
    public id?: number;
    name: string;
    code: string;
    productsWithThisBottom?: Product[];
    productTypesWithThisBottom?: ProductType[];
}

export default ProductBottom;
