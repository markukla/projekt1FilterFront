import {
  AfterContentChecked, AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef, Input,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ProductBackendService} from '../ProductServices/product-backend.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import CreateProductDto from '../../../ProductTypesAndClasses/product.dto';
import DimensionTextFIeldInfo from '../../../ProductTypesAndClasses/dimensionTextFIeldInfo';
import {getBackendErrrorMesage} from '../../../../helpers/errorHandlingFucntion/handleBackendError';
import {allUsedDimensionsCodes} from '../../../ProductTypesAndClasses/alreadyExistingDimensionList';
import {allSecondIndexDimensionCodes} from '../../../ProductTypesAndClasses/alreadyExistingDimensionList';
import {allFirstIndexDimensionCodes} from '../../../ProductTypesAndClasses/alreadyExistingDimensionList';

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
  operationFailerStatusMessage: string;
  operationSuccessStatusMessage: string;
  previouslyUsedUniqueDimensionCodes: string[] = [];
  idValue: string;
  angle = -90;
  rootUrl = 'http://localhost:5000';
  // tslint:disable-next-line:max-line-length
  /* view child is a get elementby id equivalent, and Viev childrens is something like get element by class name, but element must be marked with #elementname*/
  @ViewChild('drawingContainer', {read: ElementRef}) drawing: ElementRef;
  @ViewChildren('.inputDivHorizontal', {read: HTMLElement}) inputDivs: HTMLElement[];

  constructor(private backendService: ProductBackendService,
              private renderer: Renderer2,
              private host: ElementRef) {
    this.bgImageVariable = this.rootUrl + this.backendService.drawingPaths.urlOfOrginalDrawing;
  }


  ngOnInit(): void {
    this.createDimensionForm = new FormGroup({
      dimensionId: new FormControl(null, [Validators.required]),
      dimensionOrientation: new FormControl(null, [Validators.required]),
      newDimensionId: new FormControl(null)
    });
    console.log(` this.bgImageVariable= ${this.bgImageVariable}`);
  }

  // tslint:disable-next-line:typedef
  get dimensionId() {
    return this.createDimensionForm.get('dimensionId');
  }

  // tslint:disable-next-line:typedef
  get newDimensionId() {
    return this.createDimensionForm.get('newDimensionId');
  }

  // tslint:disable-next-line:typedef
  get dimensionOrientation() {
    return this.createDimensionForm.get('dimensionOrientation');
  }

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

  getPreviouslyUsedCodes(): void {
    console.log('in getPreviouslyUsedCodes ');
    if (this.previouslyUsedUniqueDimensionCodes.length === 0) {
      this.backendService.getRecords().subscribe((products) => {
        const allProducts = products.body;
        const allpreviouslyUsedCodes: string[] = [];
        allProducts.forEach((p) => {
          p.dimensionsTextFieldInfo.forEach((d) => {
            allpreviouslyUsedCodes.push(d.dimensionId);
          });
        });
        /* i make sure that L i D codes crucial for Index Binding will be always present, and that is why push it to table*/
        allpreviouslyUsedCodes.push(...allUsedDimensionsCodes);
        console.log(`allpreviouslyUsedCodes.length= ${allpreviouslyUsedCodes.length} `);
        const allUniquePreviouslyUsedCodes: string[] = allpreviouslyUsedCodes.filter((x, index, self) => {
          return index === self.indexOf(x);
        });
        console.log(`allUniquePreviouslyUsedCodes.length= ${allUniquePreviouslyUsedCodes.length} `);
        this.previouslyUsedUniqueDimensionCodes = allUniquePreviouslyUsedCodes;
      });

    }
  }

  setIdValue(): void {
    if (this.dimensionId.value) {
      this.idValue = this.dimensionId.value;
    }
    if (this.newDimensionId.value && !this.dimensionId.value) {

      console.log('in (!this.dimensionId.value) && this.newDimensionId) ');
      this.idValue = this.newDimensionId.value;
      this.dimensionId.setValue(this.newDimensionId.value);
      /* const selectElement = this.host.nativeElement.querySelector('select.dimensionIdSelect');
      this.renderer.setProperty(selectElement, 'value', this.newDimensionId.value ); */
    }
  }

  ngAfterContentChecked(): void {
    this.setIdValue();
  }

  ngAfterViewInit(): void {
  }

  ngAfterViewChecked(): void {

  }

}
