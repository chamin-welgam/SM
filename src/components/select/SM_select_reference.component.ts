import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  AfterContentInit,
  AfterContentChecked,
  HostListener,
  EventEmitter,
  ElementRef,
  Renderer2,
  ViewChild,
  forwardRef,
  Inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOWN_ARROW, ENTER, TAB } from '@angular/cdk/keycodes';
import { NzOptionComponent } from './nz-option.component';
import { NzSelectComponent } from './nz-select.component';
import { NzOptionPipe } from './nz-option.pipe';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropDownAnimation } from '../core/animation/dropdown-animations';
import { TagAnimation } from '../core/animation/tag-animations';
import { NzLocaleService } from '../locale/index';
import { SM_webUtilities } from '../../webUtilities/SM_webUtilities';

@Component({
  selector     : 'SM-select-reference',
  templateUrl:'SM_select_reference.component.html',
  providers    : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SM_Select_Reference_Component),
      multi      : true
    }
  ],
})
export class SM_Select_Reference_Component implements ControlValueAccessor  {
  __F_ID =0;
  __F_ENUM_GROUPID=0;
  __F_ALLOW_TO_ADD =false;
  __SMWU: SM_webUtilities;
  __items=[];
  __value=0;
  __onChange: any = Function.prototype;
  __onTouched: any = Function.prototype;
  __disabled=false;

  @Input()
  set SM_F_ID(value : number){
    if (value>0){
      this.__F_ID= value;
      // get field properties
      var _data={
        F_ID: this.__F_ID
      };
      //get the list of items/value for dropdown
      this.__SMWU.callAPIFunction(294,_data, this.onAPICallback1.bind(this))
    }
  }

  onAPICallback1(_data){
    if (_data.status=='OK')    {
      this.__items= _data.rows;
    } else{
      //error //todo
    }
  }

  get SM_F_ID() {
    return this.__F_ID;
  }
// functions
  onChange(){
    if (this.__value==-1){   
      //add or edit enum  //todo
    }else{
      this.__onChange(this.__value);
    }

  }

  writeValue(value: any): void {
    this._updateValue(value, false);
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.__onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.__onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.__disabled = isDisabled;
  }

  constructor(private __http: HttpClient,
     _elementRef: ElementRef){
    this.__SMWU= new SM_webUtilities(__http);
  }

  private _updateValue(value: number, emitChange = true) {
    if (this.__value === value) {
      return;
    }
    this.__value = value;
  }
}
