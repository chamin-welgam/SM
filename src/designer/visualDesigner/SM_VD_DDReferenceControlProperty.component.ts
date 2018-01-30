import {
  Directive,
  Input,
  HostBinding,
  ElementRef
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { HttpClient, HttpParams} from '@angular/common/http';

import * as  AppConfig from  '../../app/configuration/config.json';
import { SM_webUtilities } from "../../webUtilities/SM_webUtilities";
import { Component, OnInit } from '@angular/core';
import { now } from 'moment';

@Component({
  selector : 'SM_VD_DDReferenceControlProperty',  
  templateUrl: 'SM_VD_DDReferenceControlProperty.component.html',
  providers: [ ],
  styleUrls    : [
    './style/index.less',
    './style/patch.less'
  ]
})

export class SM_VD_DDReferenceControlPropertyComponent  implements OnInit {
  //variables
  __formNo=0;
  __ID=0;
  __F_NAME="";
  __F_DISPLAY_NAME ="";
  __F_ALLOW_NULL = false;
  __F_REF_FORMNO=0;
  __F_REF_FIELDNO = 0;
  __el: HTMLElement;
  __SMWU = new SM_webUtilities(this.__http);
  __userFormNames = [];
  __fieldNames=[];
  
  constructor(private el: ElementRef,   private __http: HttpClient,
              private __router: Router, private __activatedRouter: ActivatedRoute) {
    this.__el = this.el.nativeElement;
  }

  ngOnInit() {
    this.__activatedRouter.params.subscribe(_param => {
      this.__ID=_param['controlID'];
      this.initForm(); 
    });
  }

  //functions for initializing lists 

  //function to initialize form 
  initForm(){
    //get the controler data
    var _SP_SM_GET_FORM_FIELD=263;
    var _data={
      F_ID: this.__ID };
    var _callBack_fun = showData1.bind(this);
    this.callFunction(_SP_SM_GET_FORM_FIELD, _data, _callBack_fun);    
    
    function showData1(_data) {
      if(_data.status=='OK'){
        this.__F_ALLOW_NULL =_data.rows[0].c4;
        this.__F_DISPLAY_NAME=_data.rows[0].c3;
        this.__F_NAME=_data.rows[0].c1;
        var _SP_SM_GET_CONTROL=289;
        var _data2={
          F_ID: this.__ID };
        var _callBack_fun2 = showData2.bind(this);
        this.callFunction(_SP_SM_GET_CONTROL, _data2, _callBack_fun2);    
      }else{ //error //todo
        alert("Error \nwhile creating text control");
      }  
    }    
    function showData2(_data) {
      if(_data.status=='OK'){
        this.__F_REF_FORMNO = _data.rows[0].c1;
        this.__F_REF_FIELDNO = _data.rows[0].c2;
        var _data3={ };
        var _callBack_fun3 = onReceiveData3.bind(this);
        this.callFunction(295, _data3, _callBack_fun3);    //get FORM NAMES
      }else{ //error //todo
        alert("Error \nwhile creating text control");
      }  
    }

    function onReceiveData3(_data) {
      if(_data.status=='OK'){
        this.__userFormNames= _data.rows;
        this.getFieldNames();
      }else{ //error //todo
        alert("Error \nwhile creating text control");
      }  
    }
  }

  getFieldNames(){
    var _data3={ 
      FORM_ID: this.__F_REF_FORMNO
    };
    var _callBack_fun4 = onReceiveData4.bind(this);
    this.callFunction(296, _data3, _callBack_fun4);    //get FORM FIELD NAMES

    function onReceiveData4(_data) {
      if(_data.status=='OK'){
        this.__fieldNames= _data.rows;
      }else{ //error //todo
        alert("Error \nwhile creating text control");
      }  
    }

  }

  __F_NAME_Changed(){
    this.UpdateProperty(this.__F_NAME);
  }
  __F_DISPLAY_NAME_Changed(){
    this.UpdateProperty(null,this.__F_DISPLAY_NAME);
  }
  __F_ALLOW_NULL_Changed(){
    this.UpdateProperty(null,null,this.__F_ALLOW_NULL);
  }
  __F_REF_FORMNO_Changed(){
    this.getFieldNames();
    this.UpdateProperty(null,null,null,this.__F_REF_FORMNO);
    
  }
  __F_REF_FIELDNO_Changed(){
    this.UpdateProperty(null,null,null,null,this.__F_REF_FIELDNO);
  }

  //functions during the web activities
  UpdateProperty(_F_NAME=null , _F_DISPLAY_NAME=null, _F_ALLOW_NULL=null
      ,_F_REF_FORMNO=null, _F_REF_FIELDNO=null
      ){
    if (_F_NAME!=null || _F_DISPLAY_NAME != null || _F_ALLOW_NULL!=null ){
      var _funNo1 =256;//SP_SM_UPD_FORM_CONTROL
      var _data1={
        F_ID: this.__ID,
        F_NAME:_F_NAME,
        F_DISPLAY_NAME : _F_DISPLAY_NAME,
        F_ALLOW_NULL : _F_ALLOW_NULL
      };
      this.callFunction(_funNo1,_data1,this.updateComplete.bind(this));
    }

    if(_F_REF_FORMNO!=null 
      || _F_REF_FIELDNO!=null){
      var _funNo2=291;   //UPD DD REFERENCE FIELD
      var _data2={
        F_ID: this.__ID,
        F_REF_FORMNO: _F_REF_FORMNO,
        F_REF_FIELDNO: _F_REF_FIELDNO
      };
      this.callFunction(_funNo2,_data2,this.updateComplete.bind(this));
    }      
  }

  updateComplete(data){
    if(data.status=='OK'){
      var x = document.getElementById("__SM_msg");
      x.style.display = "block";
    }else{ //error //todo
      alert("Error \nwhile getting data \nfrom server.");
    } 
  } 

  callFunction(_funNo, _data, _callBackFunc){
    this.__SMWU.callAPIFunction(_funNo,_data,_callBackFunc);
  }

}

