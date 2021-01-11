import LocalizedName from './localizedName';
import DimensionRoleEnum from './dimensionRoleEnum';


class CreateDimensionCodeDto {
    dimensionCode: string;
    localizedDimensionNames: LocalizedName [];
    dimensionRole: DimensionRoleEnum;
}

export default CreateDimensionCodeDto;
