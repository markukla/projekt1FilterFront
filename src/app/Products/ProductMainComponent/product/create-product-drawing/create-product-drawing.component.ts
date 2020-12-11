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

@Component({
  selector: 'app-create-product-drawing',
  templateUrl: './create-product-drawing.component.html',
  styleUrls: ['./create-product-drawing.component.css']
})
export class CreateProductDrawingComponent implements OnInit, AfterContentChecked, AfterViewInit, AfterViewChecked {
  bgImageVariable: string;
  createDimensionForm: FormGroup;
  operationStatusMessage: string;
  previouslyUsedUniqueDimensionCodes: string[];
  idValue: string;
  // tslint:disable-next-line:max-line-length
  /* view child is a get elementby id equivalent, and Viev childrens is something like get element by class name, but element must be marked with #elementname*/
  @ViewChild('drawingContainer', {read: ElementRef}) drawing: ElementRef;
  @ViewChildren('.inputDivHorizontal', {read: HTMLElement}) inputDivs: HTMLElement[];

  constructor(private backendService: ProductBackendService,
              private renderer: Renderer2,
              private host: ElementRef) {
  }


  ngOnInit(): void {
    this.createDimensionForm = new FormGroup({
      dimensionId: new FormControl(null, [Validators.required]),
      dimensionOrientation: new FormControl(null, [Validators.required]),
      newDimensionId: new FormControl(null)
    });
    this.bgImageVariable = this.backendService.drawingPaths.urlOfOrginalDrawing;
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

    const input = this.renderer.createElement('input');
    const inputDiv = this.renderer.createElement('div');
    this.renderer.setProperty(input, 'value', this.idValue);
    this.renderer.setProperty(input, 'id', this.idValue);
    // this.renderer.setProperty(input, 'type', 'number');
    console.log(`inputId= ${input.id}`);
    if (this.dimensionOrientation.value === 'horizontal') {
      input.className = 'dimensionInputHorizontal';
      inputDiv.className = 'inputDivHorizontal';
    } else if (this.dimensionOrientation.value === 'vertical') {
      input.className = 'dimensionInputVertical';
      inputDiv.className = 'inputDivVertical';
    }
    /* const drawing = document.getElementById('drawingContainer'); */
    this.renderer.appendChild(inputDiv, input);
    this.renderer.appendChild(this.drawing.nativeElement, inputDiv);
    this.makeInputDivDragable(inputDiv);


  }

  makeInputDivDragable(inputDiv: HTMLElement): void {


    inputDiv.onmousedown = (event) => {

      const shiftX = event.clientX - inputDiv.getBoundingClientRect().left;
      const shiftY = event.clientY - inputDiv.getBoundingClientRect().top;
      const moveAt = (pageX, pageY) => {
        inputDiv.style.left = pageX - shiftX + 'px';
        inputDiv.style.top = pageY - shiftY + 'px';
      };

      // tslint:disable-next-line:no-shadowed-variable
      const onMouseMove = (event: any) => {
        moveAt(event.pageX, event.pageY);
      };
      inputDiv.style.position = 'absolute';
      inputDiv.style.zIndex = '1000';
      this.renderer.appendChild(this.drawing.nativeElement, inputDiv);

      moveAt(event.pageX, event.pageY);

      // moves the ball at (pageX, pageY) coordinates
      // taking initial shifts into account
      // move the ball on mousemove
      document.addEventListener('mousemove', onMouseMove);

      // drop the ball, remove unneeded handlers
      inputDiv.onmouseup = () => {
        document.removeEventListener('mousemove', onMouseMove);
        inputDiv.onmouseup = null;
      };

    };

    inputDiv.ondragstart = () => {
      return false;
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
      this.operationStatusMessage = 'dodano nowy Product';
    }, error => {
      console.log('nie udało się dodać produktu');
      this.operationStatusMessage = 'nie udało się dodać produktu';
    });


  }

  getTextFieldsPositionsAndIdAndPushItToTable(): DimensionTextFIeldInfo[] {

    const dimensionsTextFieldInfoTable: DimensionTextFIeldInfo[] = [];
    // tslint:disable-next-line:max-line-length
    const inputDivs: HTMLElement[] = this.host.nativeElement.querySelectorAll('.inputDivHorizontal, .inputDivVertical'); /* does not work for 2 class at once selected  */
    console.log(`inoutDivs lenhth=   ${inputDivs.length}`);
    for (let i = 0; i < inputDivs.length; i++) {
      const dimensionTextFIeldInfo: DimensionTextFIeldInfo = {
        dimensionId: inputDivs[i].firstElementChild.id,
        dimensionTexfieldXposition: `${inputDivs[i].style.left}px`,
        dimensionTexfieldYposition: `${inputDivs[i].style.top}px`
      };
      dimensionsTextFieldInfoTable.push(dimensionTextFIeldInfo);
    }
    return dimensionsTextFieldInfoTable;
  }

  getPreviouslyUsedCodes(): void {
    console.log('in getPreviouslyUsedCodes ');
    if (!this.previouslyUsedUniqueDimensionCodes) {
      this.backendService.getRecords().subscribe((products) => {
        const allProducts = products.body;
        const allpreviouslyUsedCodes: string[] = [];
        allProducts.forEach((p) => {
          p.dimensionsTextFieldInfo.forEach((d) => {
            allpreviouslyUsedCodes.push(d.dimensionId);
          });
        });
        console.log(`allpreviouslyUsedCodes.length= ${allpreviouslyUsedCodes.length} `);
        const allUniquePreviouslyUsedCodes: string[] = allpreviouslyUsedCodes.filter((x, index, self) => {
          return index === self.indexOf(x);
        });
        console.log(`allUniquePreviouslyUsedCodes.length= ${allUniquePreviouslyUsedCodes.length} `);
        this.previouslyUsedUniqueDimensionCodes = allUniquePreviouslyUsedCodes;
        this.previouslyUsedUniqueDimensionCodes.forEach((x) => {
          console.log(`dimensionCode= ${x}`);
        });
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
