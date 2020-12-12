class DimensionTextFIeldInfo{
  dimensionId: string;
  dimensionTexfieldXposition: string;
  dimensionTexfieldYposition: string;
  dimensionDivClass: string;
  dimensionInputClass: string;


  constructor(dimensionId: string, dimensionTexfieldXposition: string, dimensionTexfieldYposition: string, dimensionDivClass: string, dimensionInputClass: string) {
    this.dimensionId = dimensionId;
    this.dimensionTexfieldXposition = dimensionTexfieldXposition;
    this.dimensionTexfieldYposition = dimensionTexfieldYposition;
    this.dimensionDivClass = dimensionDivClass;
    this.dimensionInputClass = dimensionInputClass;
  }
}
export default DimensionTextFIeldInfo;
