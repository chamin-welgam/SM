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
  selector     : 'SM-select-enum',
  templateUrl:'SM_select_enum.component.html',
  providers    : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SM_select_enum_Component),
      multi      : true
    }
  ],
})
export class SM_select_enum_Component implements ControlValueAccessor  {
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
  set MS_F_ID(value : number){
    if (value>0){
      this.__F_ID= value;
      // get field properties
      var _data={
        F_ID: this.__F_ID
      };
      this.__SMWU.callAPIFunction(284,_data, this.onAPICallback1.bind(this))
    }
  }

  onAPICallback1(_data){
    if (_data.status=='OK')    {
      this.__F_ENUM_GROUPID = _data.rows[0].c1;
      this.__F_ALLOW_TO_ADD = _data.rows[0].c2;
      var _data2={
        enumGrpID: this.__F_ENUM_GROUPID
      };
      this.__SMWU.callAPIFunction(9,_data2, this.onAPICallback2.bind(this))
    }
  }

  onAPICallback2(_data){
    if (_data.status=='OK')    {
      this.__items= _data.rows;
      if(this.__F_ALLOW_TO_ADD){
        this.__items.push({c0:-1, c1:"Add/Edit "});
      }
    }
  }

  get MS_F_ID() {
    return this.__F_ID;
  }
// functions
  onChange(){
//    this.__value=event.taget.data;
    if (this.__value==-1){   //add or edit enum

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
