import {
  Directive,
  Input,
  HostBinding,
  ElementRef,
  Component, 
  OnInit 
} from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import * as  AppConfig from  '../../app/configuration/config.json';
import { now } from 'moment';
import {SM_webUtilities} from '../../webUtilities/SM_webUtilities';

//import consts
import * as form_controls from "../../framework/SM_CONST_form_controls"
import {DD_REFERENCE_CONTROL} from "../../framework/SM_CONST_form_controls"
import {DDENUM_CONTROL} from "../../framework/SM_CONST_form_controls"
import {NUMBER_CONTROL} from "../../framework/SM_CONST_form_controls"
import {TEXT_CONTROL} from "../../framework/SM_CONST_form_controls"

@Component({
  selector : 'SM_FE_Form',   
  templateUrl: 'SM_FE_Form.component.html',
  providers: [ ],
  styleUrls    : [
    './style/index.less',
    './style/patch.less'
  ]
})

export class SM_FE_Form  implements OnInit {
  RECORD_NEW=1;
  RECORD_VIEW=2;
  RECORD_EDIT=3;

  DATE_CONTROL= form_controls.DATE_CONTROL;
  DD_REFERENCE_CONTROL=form_controls.DD_REFERENCE_CONTROL;
  DDENUM_CONTROL=form_controls.DDENUM_CONTROL;
  NUMBER_CONTROL=form_controls.NUMBER_CONTROL;
  TEXT_CONTROL=form_controls.TEXT_CONTROL;

  //variables
  __formNo=0;
  __formName="";
  __formTitle="";
  __insertRecordFun=0;
  __updateRecordFun=0;

  __fields=[];
  __el: HTMLElement;
  __SM_webUtilities= new SM_webUtilities(this.__http);
  __currentRecordMode=this.RECORD_NEW; 
  __data={};
  
  constructor(private el: ElementRef, private __http: HttpClient, private __activatedRoute: ActivatedRoute ,
              private __router :Router, 
  ) {
    this.__el = this.el.nativeElement;
    this.__activatedRoute.params.subscribe(params => {
      this.__formNo= params['ID'];
      this.initForm();
    });
  }

  ngOnInit() {

  }

  //function to initialize form / create new
  initForm(){

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
          this.__data["F_"+_row.c0]=null;   //CREAte variables to hold form data
        });
        this.__fields=_data.rows;
        //get form properties
        var _data1={
          FORM_NO:this.__formNo
        }
        this.callFunction(264, _data1, onReceiveData2.bind(this));
      }else{ //error //todo
        alert("Error \nwhile creating controls");
      }  
    }

    function onReceiveData2(_data2){
      if(_data2.status=='OK'){
        this.__formName=_data2.rows[0].c1;
        this.__formTitle=_data2.rows[0].c2;
        this.__insertRecordFun=_data2.rows[0].c3;
        //todo
        //edit mode not yet introducde
        //when introduced remove the remarks lines
        // this.__updateRecordFun=_datas.rows[0].c4;

      }else{ //error //todo
        alert("Error \nwhile getting data \nfrom server.");
      }  
    }
  }

  callFunction(_funNo, _data, _callBackFunc){
    this.__SM_webUtilities.callAPIFunction(_funNo, _data,_callBackFunc, this.__http);
  }

  //function to save save / save button click
  save(){
    if(this.__currentRecordMode==this.RECORD_VIEW) {
      alert("Not on EDIT mode");
      return;
    }
    var _data={
      F_FORM_NO: this.__formNo
    };
    for (var _dt in this.__data) {
      _data[_dt]=this.__data[_dt];   //CREAte variables to hold form data
    };
    var _saveFunction = this.__currentRecordMode==this.RECORD_NEW? this.__insertRecordFun: this.__updateRecordFun;
    this.callFunction(_saveFunction ,_data, this.onSaveComplete.bind(this))
  }

  onSaveComplete(_data){
    if(_data.status=='OK'){
      alert("saved!!");
    }else{ //error //todo
      alert("Error \nwhile saving");
    }  
  }
}

