import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Directive,
  ElementRef, EventEmitter,
  HostListener,
  Input, OnInit, Output,
  Renderer2
} from '@angular/core';
import {Sort} from '../util/sort';

@Directive({
  selector: '[appSearch]'
})
export class SearchDirective implements AfterContentChecked {

  @Input('appSearch') searchedArray: Array<any>;

  orginalArrayCopy: Array<any> = [];

  serchCondition: string;

  // tslint:disable-next-line:max-line-length
  @Input() serchedColumn: string; /* insted of this input i could just declate atribute name in html(it creates completly new Atribute in html) than i can access to its value by target elements object */

  temporatyArray: Array<any> = [];
  @Output()
  inputeventEmitter = new EventEmitter<boolean>();
  allowOrginalArrayCopyChange: boolean;


  constructor(private renderer: Renderer2, private targetElement: ElementRef) {
    this.allowOrginalArrayCopyChange = true;
  }

  ngAfterContentChecked(): void {


    console.log(`this.allowOrginalArrayCopyChange before input= ${ this.allowOrginalArrayCopyChange}`);
    this.inputeventEmitter.subscribe((event) => {
      this.allowOrginalArrayCopyChange = false;
      console.log(`this.allowOrginalArrayCopyChange afterInput= ${this.allowOrginalArrayCopyChange}`);
    });

    if (this.searchedArray !== undefined) {
      if (this.allowOrginalArrayCopyChange){
        console.log('inside if this.allowOrginalArrayCopyChange === true');
        this.orginalArrayCopy.length = 0;
        this.orginalArrayCopy.push(...this.searchedArray);
      }
    }
  }

  @HostListener('input')
// tslint:disable-next-line:typedef
  serchTable() {
    this.inputeventEmitter.emit();
    const elem = this.targetElement.nativeElement;

    // tslint:disable-next-line:max-line-length
    /*remember using directives it is better to access element property using target element than doing some extra binding with ng model etc */
    this.serchCondition = elem.value;


    console.log(`this property=${this.serchedColumn}`);
    console.log(`this.orginalArraycopy=${this.orginalArrayCopy}`);
    console.log(`this.serchcondition= ${this.serchCondition}`);
    this.temporatyArray.length = 0;
    this.searchedArray.length = 0;
    this.temporatyArray = this.orginalArrayCopy.filter(
      x => x[this.serchedColumn].includes(this.serchCondition)
    );

    // tslint:disable-next-line:max-line-length
    /*when i use filter to serch array it some how does not work, because it is creating new instance of array and directive is bind to previous instance*/
    /*that is why a remove all elements in orginal array and push there temporary array values*/
    this.searchedArray.length = 0;
    this.searchedArray.push(...this.temporatyArray);


    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.searchedArray.length; i++) {
      console.log(this.searchedArray[i]);
    }

  }


}
