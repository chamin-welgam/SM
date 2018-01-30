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
  TEXT_CONTROL=3824;
  NUMBER_CONTROL=3825;
  DATE_CONTROL=3826;
  DD_REFERENCE_CONTROL=3828;
  DDENUM_CONTROL=3829;
  //variables
  __formNo=31;
  __formName="";
  __title="";
  __fields=[];
  __el: HTMLElement;
  __SM_webUtilities : SM_webUtilities
  __data={};
  
  constructor(private el: ElementRef, private __http: HttpClient, private __activatedRoute: ActivatedRoute ,
              private __router :Router, 
  ) {
    this.__el = this.el.nativeElement;
    this.__activatedRoute.queryParams.subscribe(params => {
      this.__formNo= params['formNo'];
    });
    this.__SM_webUtilities = new SM_webUtilities(this.__http);
  }

  ngOnInit() {
    this.initForm();
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
      }else{ //error //todo
        alert("Error \nwhile creating controls");
      }  
    }
  }

  callFunction(_funNo, _data, _callBackFunc){
    this.__SM_webUtilities.callAPIFunction(_funNo, _data,_callBackFunc, this.__http);
  }

  //function to save save / save button click
  save(){
    var _data={
      F_FORM_NO: this.__formNo
    };
    for (var _dt in this.__data) {
      _data[_dt]=this.__data[_dt];   //CREAte variables to hold form data
    };
    var _SaveFunNumber = 175;
    this.callFunction(_SaveFunNumber ,_data, this.onSaveComplete.bind(this))
  }

  onSaveComplete(_data){
    if(_data.status=='OK'){
      alert("saved!!");
    }else{ //error //todo
      alert("Error \nwhile saving");
    }  
  }
}

