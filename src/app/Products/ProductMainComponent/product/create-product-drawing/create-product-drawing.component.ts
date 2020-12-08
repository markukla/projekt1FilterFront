import {Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {ProductBackendService} from '../ProductServices/product-backend.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-product-drawing',
  templateUrl: './create-product-drawing.component.html',
  styleUrls: ['./create-product-drawing.component.css']
})
export class CreateProductDrawingComponent implements OnInit {
  bgImageVariable: string;
  createDimensionForm: FormGroup;
  // tslint:disable-next-line:max-line-length
  /* view child is a get elementby id equivalent, and Viev childrens is something like get element by class name, but element must be marked with #elementname*/
  @ViewChild('drawingContainer', {read: ElementRef}) drawing: ElementRef;

  constructor(private backendService: ProductBackendService,
              private renderer: Renderer2,
              private host: ElementRef) { }



  ngOnInit(): void {
    this.createDimensionForm = new FormGroup({
      dimensionId: new FormControl('', [Validators.required]),
      dimensionOrientation: new FormControl(null, [Validators.required]),
    });
    this.bgImageVariable = this.backendService.drawingPaths.urlOfOrginalDrawing;
    console.log(` this.bgImageVariable= ${this.bgImageVariable}`);
  }


  // tslint:disable-next-line:typedef
  get  dimensionId() {
    return this.createDimensionForm.get('dimensionId');
  }
  // tslint:disable-next-line:typedef
  get  dimensionOrientation() {
    return this.createDimensionForm.get('dimensionOrientation');
  }
  onSubmit(): void {

    const input = this.renderer.createElement('input');
    const inputDiv = this.renderer.createElement('div');
    const idValue: string =  this.dimensionId.value;
    this.renderer.setProperty(input, 'value', idValue);
    this.renderer.setProperty(input, 'id', this.dimensionId.value);
    // this.renderer.setProperty(input, 'type', 'number');
    console.log(`inputId= ${input.id}`);
    if (this.dimensionOrientation.value === 'horizontal')
    {
      input.className = 'dimensionInputHorizontal';
      inputDiv.className = 'inputDivHorizontal';
    }
    else if (this.dimensionOrientation.value === 'vertical' ){
      input.className = 'dimensionInputVertical';
      inputDiv.className = 'inputDivVertical';
    }
    /* const drawing = document.getElementById('drawingContainer'); */
    this.renderer.appendChild(inputDiv, input);
    const dragableDiv = this.renderer.createElement('app-resizable-draggable');
    dragableDiv.style.position = 'absolute';
    dragableDiv.style.zIndex = '1000';
    console.log(`dragable div= ${dragableDiv}`);
    this.renderer.appendChild(this.drawing.nativeElement, dragableDiv);
    this.renderer.appendChild(this.drawing.nativeElement, inputDiv);
    this.makeInputDivDragable(inputDiv);


  }

  makeInputDivDragable(inputDiv: HTMLElement): void{



    inputDiv.onmousedown =  (event) => {

      let shiftX = event.clientX - inputDiv.getBoundingClientRect().left;
      let shiftY = event.clientY - inputDiv.getBoundingClientRect().top;
      const  moveAt = (pageX, pageY) => {
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
      inputDiv.onmouseup =  () => {
        document.removeEventListener('mousemove', onMouseMove);
        inputDiv.onmouseup = null;
      };

    };

    inputDiv.ondragstart =  () => {
      return false;
    };


  }

}
