import LocalizedName from './localizedName';
import DimensionRoleEnum from './dimensionRoleEnum';

class LocalizedDimensionCode {
  public id?: number;
  dimensionCode: string;
  localizedDimensionName: LocalizedName;
  dimensionRole: DimensionRoleEnum;
}

export default LocalizedDimensionCode;
