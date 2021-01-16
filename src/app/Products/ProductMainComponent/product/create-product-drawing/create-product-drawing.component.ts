import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ProductBackendService} from '../ProductServices/product-backend.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import CreateProductDto from '../../../ProductTypesAndClasses/product.dto';
import DimensionTextFIeldInfo from '../../../ProductTypesAndClasses/dimensionTextFIeldInfo';
import {getBackendErrrorMesage} from '../../../../helpers/errorHandlingFucntion/handleBackendError';
import {DimensionCodeBackendService} from '../../../../DimensionCodes/DimensionCodeServices/dimension-code-backend.service';
import DimensionCode from '../../../../DimensionCodes/DimensionCodesTypesAnClasses/diemensionCode.entity';
import LocalizedDimensionCode from '../../../../DimensionCodes/DimensionCodesTypesAnClasses/localizedDimensionCode';
import DimensionRoleEnum from '../../../../DimensionCodes/DimensionCodesTypesAnClasses/dimensionRoleEnum';

@Component({
  selector: 'app-create-product-drawing',
  templateUrl: './create-product-drawing.component.html',
  styleUrls: ['./create-product-drawing.component.css']
})
export class CreateProductDrawingComponent implements OnInit, AfterContentChecked, AfterViewInit, AfterViewChecked {
  @Input()
  tableForm: FormGroup;
  bgImageVariable: string;
  createDimensionForm: FormGroup;
  dimensionRoleForm: FormGroup;
  operationFailerStatusMessage: string;
  operationSuccessStatusMessage: string;
  allDimensionCodes: LocalizedDimensionCode [];
  allFirstIndexDimensionCodes: LocalizedDimensionCode[];
  allSecondIndexDimensionCOde: LocalizedDimensionCode [];
  allNonIndexDimensionCodes: LocalizedDimensionCode [];
  selectedLanguageLang: string = 'PL'; /* it will be the value obtained form login service in the future*/
  addNewClicked = false;
  idValue: string;
  angle = -90;
  rootUrl = 'http://localhost:5000';
  @Input()
  newDimension: DimensionCode;
  newLocalizedDimension: LocalizedDimensionCode;
  // tslint:disable-next-line:max-line-length
  /* view child is a get elementby id equivalent, and Viev childrens is something like get element by class name, but element must be marked with #elementname*/
  @ViewChild('drawingContainer', {read: ElementRef}) drawing: ElementRef;
  @ViewChildren('.inputDivHorizontal', {read: HTMLElement}) inputDivs: HTMLElement[];
  dimensionRoleFirstIndexDimensionDescription = 'Pierwszy Wymiar Indeksu';
  dimensionRoleFirstIndex: DimensionRoleEnum = DimensionRoleEnum.FIRSTINDEXDIMENSION;
  dimensionRoleSecondIndexDimensionDescription = 'Drugi wymiar Indeksu';
  dimensionRoleSecondIndex: DimensionRoleEnum = DimensionRoleEnum.SECONDINDEXDIMENSION;
  dimensionRoleNoIndexDimensionDescription = 'Wymiar nie wchodzący do indeksu';
  dimensionRoleNoIndex: DimensionRoleEnum = DimensionRoleEnum.NOINDEXDIMENSION;

  constructor(private backendService: ProductBackendService,
              private renderer: Renderer2,
              private host: ElementRef,
              private dimensionBackendService: DimensionCodeBackendService) {
    this.bgImageVariable = this.rootUrl + this.backendService.drawingPaths.urlOfOrginalDrawing;
  }


 async ngOnInit(): Promise<void> {
   this.createDimensionForm = new FormGroup({
     dimensionId: new FormControl(null, [Validators.required]),
     dimensionOrientation: new FormControl(null, [Validators.required]),
   });
   this.dimensionRoleForm = new FormGroup({
     dimensionRole: new FormControl(null, [Validators.required]),
   });
   await this.getPreviouslyUsedCodes();
   console.log(` this.bgImageVariable= ${this.bgImageVariable}`);
  }
  // tslint:disable-next-line:typedef
  get dimensionRole() {
    return this.dimensionRoleForm.get('dimensionRole');
  }
  // tslint:disable-next-line:typedef
  get dimensionId() {
    return this.createDimensionForm.get('dimensionId');
  }

  // tslint:disable-next-line:typedef


  // tslint:disable-next-line:typedef


  onSubmitForInputCreating(): void {

    const input = this.renderer.createElement('textarea');
    this.renderer.setProperty(input, 'value', this.idValue);
    this.renderer.setProperty(input, 'id', this.idValue);
    // this.renderer.setProperty(input, 'type', 'number');
    console.log(`inputId= ${input.id}`);
    input.className = 'dimensionInputHorizontal';
    input.style.overflow = 'auto';
    input.style.resize = 'both';
    /* const drawing = document.getElementById('drawingContainer'); */
    this.renderer.appendChild(this.drawing.nativeElement, input);
    this.makeInputDivDragable(input);
    this.rotateTextField(input);


  }

   rotateTextField(textField): void {

    textField.addEventListener('dblclick', () => {

      console.log(this.angle);
      textField.style.transform = `rotate(${this.angle}deg)`;
      if (this.angle === -90) {
        this.angle = 90;
      }
      else if (this.angle === 90) {
        this.angle = 0;
      }
      else {
        this.angle = -90;
      }
      /*  it is always horizontal, because rotation means that horizontal dimension become also vertical*/
      textField.style.resize = 'horizontal';
    });
  }

  makeInputDivDragable(input: HTMLElement): void {

    let dragable = true;

    input.addEventListener('contextmenu', (ev) => {

      ev.preventDefault();
      if (dragable === true) {
        dragable = false;
      } else if (dragable === false) {
        dragable = true;
      }
    });


    input.onmousedown = (event) => {

      console.log(`event.type= ${event.type}`);
      console.log(`textfield.style.transform= ${input.style.transform}`);
      console.log(`textfield.style.width= ${input.style.width}`);
      console.log(`textfield.style.height= ${input.style.height}`);
      const texfieldWith = document.getElementById(input.id).style.width;
      console.log(`texfieldWith= ${texfieldWith}`);
      if (dragable === true && event.type !== 'dblclick') {
        // event.clientX and event.clientY are mouse pointer coordinates
        //  textField.getBoundingClientRect().left distance from left corner to html.element
        const transform = input.style.transform;
        const inputWidth = input.style.width;
        const inputWidthNumber = Number(inputWidth.split('px')[0]);
        const inputHeight = input.style.height;
        const inputHeightNumber = Number(inputHeight.split('px')[0]);
        const widthMinusHeightDevidedBy2 = (inputWidthNumber - inputHeightNumber) / 2;
        let shiftX: number;
        let shiftY: number;
        if (!transform || transform === '') {
           shiftX = event.clientX - input.getBoundingClientRect().left;
           shiftY = event.clientY - input.getBoundingClientRect().top;
        }
        else if (transform && (transform === 'rotate(-90deg)' || transform === 'rotate(90deg)')) {
          shiftX = event.clientX - input.getBoundingClientRect().left + widthMinusHeightDevidedBy2;
          shiftY = event.clientY - input.getBoundingClientRect().top - widthMinusHeightDevidedBy2;
        }

        input.style.position = 'absolute';
        input.style.zIndex = '1000';
        this.renderer.appendChild(this.drawing.nativeElement, input);
        const moveAt = (pageX, pageY) => {
          const textFieldWidth = input.style.width;
          const textFieldHeight = input.getBoundingClientRect().height;
          console.log(textFieldHeight);
          input.style.left = pageX - shiftX + 'px';
          input.style.top = pageY - shiftY + 'px';

          /*
          widght=60, height=20 widght-height= 40, widght-height/2 = 20 which is correction value
           textField.style.left = pageX - shiftX - 20  + 'px';
          textField.style.top = pageY - shiftY + 20 + 'px';*/
        };
        moveAt(event.pageX, event.pageY);

        // moves the ball at (pageX, pageY) coordinates
        // taking initial shifts into account
        const onMouseMove = (event: any) => {
          moveAt(event.pageX, event.pageY);
        };

        // move the ball on mousemove
        document.addEventListener('mousemove', onMouseMove);

        // drop the ball, remove unneeded handlers
        document.onmouseup = () => {
          document.removeEventListener('mousemove', onMouseMove);
          input.onmouseup = null;
        };

      }
      input.ondragstart = () => {
        return false;
      };
    };
  }
  saveProductInDatabas(): void {

    const dimensionFieldInfoTable: DimensionTextFIeldInfo[] = this.getTextFieldsPositionsAndIdAndPushItToTable();
    const createProductDto: CreateProductDto = {
      productBottom: this.backendService.selectedBottom,
      productTop: this.backendService.selectedTop,
      productType: this.backendService.selectedType,
      urlOfOrginalDrawing: this.backendService.drawingPaths.urlOfOrginalDrawing,
      urlOfThumbnailDrawing: this.backendService.drawingPaths.urlOfThumbnailDrawing,
      dimensionsCodes: '',
      dimensionsTextFieldInfo: dimensionFieldInfoTable
    };
    this.backendService.addRecords(createProductDto).subscribe((product) => {
      console.log('dodano nowy Product');
      this.operationSuccessStatusMessage = 'dodano nowy Product';
    }, (error) => {
      const errorMessage = getBackendErrrorMesage(error);
      if (errorMessage.includes('Already exist in database')) {
        this.operationFailerStatusMessage = 'nie udało się dodać produktu, produkt o podanych parametrach już istnieje w bazie danych';
      } else {
        this.operationFailerStatusMessage = 'wystąpił bład, nie udało sie dodać produktu, spróbuj ponownie';
      }
    });


  }

  getTextFieldsPositionsAndIdAndPushItToTable(): DimensionTextFIeldInfo[] {

    const dimensionsTextFieldInfoTable: DimensionTextFIeldInfo[] = [];
    // tslint:disable-next-line:max-line-length
    const inputDivs: HTMLElement[] = this.host.nativeElement.querySelectorAll('.dimensionInputHorizontal');
    for (let i = 0; i < inputDivs.length; i++) {
      /* const inputDivRelativeToContainerXPosition = inputDivs[i].style.left/this.drawing */
      const dimensionTextFIeldInfo: DimensionTextFIeldInfo = {
        dimensionId: inputDivs[i].id,
        dimensionTexfieldXposition: `${inputDivs[i].style.left}`,
        dimensionTexfieldYposition: `${inputDivs[i].style.top}`,
        dimensionTexFieldHeight: `${inputDivs[i].style.height}`,
        dimensionTexFieldWidth: `${inputDivs[i].style.width}`,
        dimensionInputClass: inputDivs[i].className,
        transform: `${inputDivs[i].style.transform}`,
      };
      dimensionsTextFieldInfoTable.push(dimensionTextFIeldInfo);
    }
    return dimensionsTextFieldInfoTable;
  }

  async getPreviouslyUsedCodes(): Promise<void> {
    try {
      const allDimensions = await this.dimensionBackendService.getRecords().toPromise();
      this.allDimensionCodes = this.getLocalizedNameFromAllLanguage(allDimensions.body);

    }
    catch (error: any) {
      console.log('could not get all dimensions');
    }
    try {
      const allFirstIndexDimensions = await this.dimensionBackendService.getFirstIndexDimensions().toPromise();
      this.allFirstIndexDimensionCodes = this.getLocalizedNameFromAllLanguage(allFirstIndexDimensions.body);

    }
    catch (error: any) {
      console.log('could not get allFirstIndexDimensions');
    }
    try {
      const secondIndexDimensions = await this.dimensionBackendService.getSecondIndexDimensions().toPromise();
      this.allSecondIndexDimensionCOde = this.getLocalizedNameFromAllLanguage(secondIndexDimensions.body);

    }
    catch (error: any) {
      console.log('could not get secondIndexDimensions');
    }
    try {
      const noIndexDimensions = await this.dimensionBackendService.getNonIndexDimensions().toPromise();
      this.allNonIndexDimensionCodes = this.getLocalizedNameFromAllLanguage(noIndexDimensions.body);

    }
    catch (error: any) {
      console.log('could not get noIndexDimensions');
    }
  }

  setIdValue(): void {
    if (this.newDimension) {
      this.addNewClicked = false;
      console.log('in (!this.dimensionId.value) && this.newDimension) ');
      this.newLocalizedDimension = this.getLocalizedDimensionFromDimension(this.newDimension);
      if (this.newLocalizedDimension.dimensionRole === DimensionRoleEnum.FIRSTINDEXDIMENSION) {
        this.allFirstIndexDimensionCodes.push(this.newLocalizedDimension);
      }
      else if (this.newLocalizedDimension.dimensionRole === DimensionRoleEnum.SECONDINDEXDIMENSION) {
        this.allSecondIndexDimensionCOde.push(this.newLocalizedDimension);
      }
      else if (this.newLocalizedDimension.dimensionRole === DimensionRoleEnum.NOINDEXDIMENSION) {
        this.allNonIndexDimensionCodes.push(this.newLocalizedDimension);
      }
      this.idValue = this.newLocalizedDimension.dimensionCode;
      this.dimensionId.setValue(this.newLocalizedDimension.dimensionCode);
      /* const selectElement = this.host.nativeElement.querySelector('select.dimensionIdSelect');
      this.renderer.setProperty(selectElement, 'value', this.newDimension.value ); */
    }
    else if (this.dimensionId.value) {
      this.idValue = this.dimensionId.value;
    }
  }

    ngAfterContentChecked(): void {
    this.setIdValue();
  }

  ngAfterViewInit(): void {
  }

  ngAfterViewChecked(): void {

  }
  getLocalizedNameFromAllLanguage(dimensnionCodes: DimensionCode[]): LocalizedDimensionCode[] {
    const localizedDimensionCodes: LocalizedDimensionCode[] = [];
    dimensnionCodes.forEach((dimensionCOde) => {
      dimensionCOde.localizedDimensionNames.forEach((localizedName) => {
        if (localizedName.languageCode === this.selectedLanguageLang) {
          const localizedCode: LocalizedDimensionCode = {
            ...dimensionCOde,
            localizedDimensionName: localizedName
          };
          localizedDimensionCodes.push(localizedCode);
        }
      });
    });
    return localizedDimensionCodes;
  }
  getLocalizedDimensionFromDimension(dimension: DimensionCode): LocalizedDimensionCode {
    let localizedDimensionCode: LocalizedDimensionCode;
    dimension.localizedDimensionNames.forEach((localizedName) => {
        if (localizedName.languageCode === this.selectedLanguageLang) {
          localizedDimensionCode = {
            ...dimension,
            localizedDimensionName: localizedName
          };
        }
      });
    return localizedDimensionCode;
  }

  onNewProductCreated(event: DimensionCode): void {
    console.log('in on product created');
    this.newDimension = event;
    this.addNewClicked = false;

  }

}
