import LocalizedName from './localizedName';
import DimensionRoleEnum from './dimensionRoleEnum';


class DimensionCode {
    public id?: number;
    dimensionCode: string;
    localizedDimensionNames: LocalizedName [];
    dimensionRole: DimensionRoleEnum;
}

export default DimensionCode;
