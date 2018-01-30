import {
  Directive,
  Input,
  HostBinding,
  ElementRef,
  Component, 
  OnInit 
} from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { HttpClient, HttpParams} from '@angular/common/http';
import * as  AppConfig from  '../../app/configuration/config.json';
import { SM_webUtilities } from '../../webUtilities/SM_webUtilities' 
import { now } from 'moment';

@Component({
  selector : 'SM_VD_FormDesigner',  
  templateUrl: 'SM_VD_FormDesigner.component.html',
  providers: [ ],
  styleUrls    : [
    './style/index.less',
    './style/patch.less'
  ]
})

export class SM_VD_FormDesignerComponent  implements OnInit {
  TEXT_CONTROL=3824;
  NUMBER_CONTROL=3825;
  DATE_CONTROL=3826;
  DD_REFERENCE_CONTROL=3828;
  DDENUM_CONTROL=3829;
  //variables
  __formNo=0;
  __formName="";
  __title="";
  __el: HTMLElement;
  __SMWU = new SM_webUtilities(this.__http);
  
  constructor(private el: ElementRef, private __http: HttpClient, private __activatedRoute: ActivatedRoute ,
              private __router :Router) {
    this.__el = this.el.nativeElement;
    this.__activatedRoute.queryParams.subscribe(params => {
      this.__formNo= params['formNo'];
    });
  }

  ngOnInit() {
    this.__formNo=this.__activatedRoute.snapshot.params['formNo'];
    console.log(this.__router);
    this.initForm();
  }

  //functions for initializing lists 

  //function to initialize form / create new
  initForm(){
    this.__formName="";
    this.__title="";
    //get fields and add to screen
    var _data={
      F_FORM_NO: this.__formNo
    };
    var _SP_SM_GET_FORM_FIELDS = 260
    this.callFunction(_SP_SM_GET_FORM_FIELDS,_data, getFields.bind(this))

    function getFields(_data) 
    {
      if(_data.status=='OK'){
        _data.rows.forEach(_row => {
          if(_row.c2== this.TEXT_CONTROL){
            this.addTextFieldToScreen(_row);
          } else if(_row.c2== this.NUMBER_CONTROL){
            this.addNumberFieldToScreen(_row);
          } else if(_row.c2== this.DATE_CONTROL){
            this.addDateFieldToScreen(_row);
          } else if(_row.c2== this.DDENUM_CONTROL){
            this.addDDEnumFieldToScreen(_row);
          } else if(_row.c2== this.DD_REFERENCE_CONTROL){
            this.addDDReferenceFieldToScreen(_row);
          }       
        });
      }else{ //error //todo
        alert("Error \nwhile creating  control");
      }  
    }
  }

  addTextFieldToScreen(_data, _select){
    var newEle =  document.createElement("div");
    newEle.innerText = _data.c3;
    newEle.id="__text"+_data.c0;
    newEle.addEventListener("click",
        ()=>{this.controlSeleted(this.TEXT_CONTROL, _data.c0)}, false);
    var target = document.getElementById('formContents');
    target.appendChild(newEle);
    if (_select) newEle.click();
  }

  addNumberFieldToScreen(_data, _select){
    var newEle =  document.createElement("div");
    newEle.innerText = _data.c3;
    newEle.id="__number"+_data.c0;
    newEle.addEventListener("click",
        ()=>{this.controlSeleted(this.NUMBER_CONTROL, _data.c0)}, false);
    var target = document.getElementById('formContents');
    target.appendChild(newEle);
    if (_select) newEle.click();
  }

  addDateFieldToScreen(_data, _select){
    var newEle =  document.createElement("div");
    newEle.innerText = _data.c3;
    newEle.id="__Date"+_data.c0;
    newEle.addEventListener("click",
        ()=>{this.controlSeleted(this.DATE_CONTROL, _data.c0)}, false);
    var target = document.getElementById('formContents');
    target.appendChild(newEle);
    if (_select) newEle.click();
  }

  addDDEnumFieldToScreen(_data, _select){
    var newEle =  document.createElement("div");
    newEle.innerText = _data.c3;
    newEle.id="__DDEnum"+_data.c0;
    newEle.addEventListener("click",
        ()=>{this.controlSeleted(this.DDENUM_CONTROL, _data.c0)}, false);
    var target = document.getElementById('formContents');
    target.appendChild(newEle);
    if (_select) newEle.click();
  }

  addDDReferenceFieldToScreen(_data, _select){
    var newEle =  document.createElement("div");
    newEle.innerText = _data.c3;
    newEle.id="__DDreference"+_data.c0;
    newEle.addEventListener("click",
        ()=>{this.controlSeleted(this.DD_REFERENCE_CONTROL, _data.c0)}, false);
    var target = document.getElementById('formContents');
    target.appendChild(newEle);
    if (_select) newEle.click();
  }

  formSeleted()
  {
    // this.__router.navigate(['/designer/formDesigner/formNo/31']);
    this.__router.navigate(['/designer/formDesigner',{outlets: {prop: ['formNo',this.__formNo]}}]);
  }

  controlSeleted(_type, _ID)
  {
    if(_type==this.TEXT_CONTROL)  { //text control
      this.__router.navigate(['/designer/formDesigner',{outlets: {prop: ['TextControl',_ID]}}]);
    }else if(_type==this.NUMBER_CONTROL){   //number control
      this.__router.navigate(['/designer/formDesigner',{outlets: {prop: ['NumberControl',_ID]}}]);
    }else if(_type==this.DATE_CONTROL){   //date control
      this.__router.navigate(['/designer/formDesigner',{outlets: {prop: ['DateControl',_ID]}}]);
    }else if(_type==this.DDENUM_CONTROL){   //DropDown control
      this.__router.navigate(['/designer/formDesigner',{outlets: {prop: ['DDEnumControl',_ID]}}]);
    }else if(_type==this.DD_REFERENCE_CONTROL){   //DropDown REFERENCE control
      this.__router.navigate(['/designer/formDesigner',{outlets: {prop: ['DDReferenceControl',_ID]}}]);
    }
  }
  
  addTextControl(){
    var _data={
      FORM_NO: this.__formNo
    };
    var _ID=0;
    //calling function SM_CREATE_TEXT_CONTROL = 265
    this.callFunction(265,_data, addTextControlStep2.bind(this))

    function addTextControlStep2(_data)
    {
      if(_data.status=='OK'){
        this.addTextFieldToScreen(_data.rows[0], true);
      }else{ //error //todo
        alert("Error \nwhile creating text control");
      }  
    }
  }

  addNumberControl(){
    var _data={
      FORM_NO: this.__formNo
    };
    var _ID=0;
    //calling function SM_CREATE_NUMBER_CONTROL = 270
    this.callFunction(270,_data, addNumberControlStep2.bind(this))

    function addNumberControlStep2(_data)
    {
      if(_data.status=='OK'){
        this.addNumberFieldToScreen(_data.rows[0], true);
      }else{ //error //todo
        alert("Error \nwhile creating text control");
      }  
    }
  }

  addDateControl(){
    var _data={
      FORM_NO: this.__formNo
    };
    var _ID=0;
    //calling function SM_CREATE_DATE_CONTROL = 282
    this.callFunction(282,_data, addDateControlStep2.bind(this))

    function addDateControlStep2(_data)
    {
      if(_data.status=='OK'){
        this.addDateFieldToScreen(_data.rows[0], true);
      }else{ //error //todo
        alert("Error \nwhile creating control");
      }  
    }
  }

  addDDEnumControl(){
    var _data={
      FORM_NO: this.__formNo
    };
    var _ID=0;
    //calling function SM_CREATE_DDENUM_FIELD = 286
    this.callFunction(286,_data, addControlStep2.bind(this))

    function addControlStep2(_data)
    {
      if(_data.status=='OK'){
        this.addDDEnumFieldToScreen(_data.rows[0], true);
      }else{ //error //todo
        alert("Error \nwhile creating control");
      }  
    }
  } 

  addDDReferenceControl(){
    var _data={
      FORM_NO: this.__formNo
    };
    var _ID=0;
    //calling function SM CREATE DD reference control = 292
    this.callFunction(292,_data, addControlStep2.bind(this))

    function addControlStep2(_data)
    {
      if(_data.status=='OK'){
        this.addDDReferenceFieldToScreen(_data.rows[0], true);
      }else{ //error //todo
        alert("Error \nwhile creating control");
      }  
    }
  } 

  callFunction(_funNo, _data, _callBackFunc){
    this.__SMWU.callAPIFunction(_funNo,_data,_callBackFunc);
  }

  //function to save save / save button click
  save(){
  }

}

