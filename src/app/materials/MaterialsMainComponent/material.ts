import {TableRecord} from '../../GenericServices/tableRecord';

export class Material extends TableRecord{
  id?: number;
  materialCode: string;
  materialName: string;
}
