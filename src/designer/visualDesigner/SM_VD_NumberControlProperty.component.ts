import {
  Directive,
  Input,
  HostBinding,
  ElementRef
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { HttpClient, HttpParams} from '@angular/common/http';

import * as  AppConfig from  '../../app/configuration/config.json';

import { Component, OnInit } from '@angular/core';
import { now } from 'moment';

@Component({
  selector : 'SM_VD_NumberControlProperty',  
  templateUrl: 'SM_VD_NumberControlProperty.component.html',
  providers: [ ],
  styleUrls    : [
    './style/index.less',
    './style/patch.less'
  ]
})

export class SM_VD_NumberControlPropertyComponent  implements OnInit {
  //variables
  __formNo=0;
  __ID=0;
  __F_NAME="";
  __F_DISPLAY_NAME ="";
  __F_ALLOW_NULL = false;
  __F_LENGTH=100;
  __F_DECIMAL_PLACES=0;
  __F_MIN_NUMBER = 0;
  __F_MAX_NUMBER = 0;
  __el: HTMLElement;
  
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
        var _SP_SM_GET_NUMBER_CONTROL=269;
        var _data2={
          F_ID: this.__ID };
        var _callBack_fun2 = showData2.bind(this);
        this.callFunction(_SP_SM_GET_NUMBER_CONTROL, _data2, _callBack_fun2);    
          }else{ //error //todo
        alert("Error \nwhile creating text control");
      }  
    }    
    function showData2(_data) {
      if(_data.status=='OK'){
        this.__F_LENGTH =_data.rows[0].c1;
        this.__F_DECIMAL_PLACES=_data.rows[0].c2;
        this.__F_MIN_NUMBER = _data.rows[0].c3;
        this.__F_MAX_NUMBER = _data.rows[0].c4;
      }else{ //error //todo
        alert("Error \nwhile creating text control");
      }  
    }    
  }

  //function to  create new
  newFormData(){
  }

  //function to save save / save button click
  save(){
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
  __F_LENGTH_Changed(){
    this.UpdateProperty(null,null,null,this.__F_LENGTH);
  }
  __F_DECIMAL_PLACES_Changed(){
    this.UpdateProperty(null,null,null,null,this.__F_DECIMAL_PLACES);
  }
  __F_MIN_NUMBER_Changed(){
    this.UpdateProperty(null,null,null,null,null,this.__F_MIN_NUMBER);
  }
  __F_MAX_NUMBER_Changed(){
    this.UpdateProperty(null,null,null,null,null,null,this.__F_MAX_NUMBER);
  }

  //functions during the web activities
  UpdateProperty(_F_NAME=null , _F_DISPLAY_NAME=null, _F_ALLOW_NULL=null
      , _F_LENGTH=null , _F_DECIMAL_PLACES=null ,_F_MIN_NUMBER=null, _F_MAX_NUMBER =null
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

    if(_F_LENGTH!=null || _F_DECIMAL_PLACES != null || _F_MAX_NUMBER!=null 
      || _F_MIN_NUMBER!=null){
    var _funNo2=268;   //SP_SM_UPD_NUMBER_CONTROL
      var _data2={
        F_ID: this.__ID,
        F_LENGTH: _F_LENGTH,
        F_DECIMAL_PLACES: _F_DECIMAL_PLACES,
        F_MIN_NUMBER: _F_MIN_NUMBER,
        F_MAX_NUMBER: _F_MAX_NUMBER
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
    var _url= (<any>AppConfig).httpCallPath+"/api/function";
      
    var _params = new HttpParams()
      .append('funNo', `${_funNo}`)
      .append('data', `${JSON.stringify(_data)}`);
    this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
      _callBackFunc(data);
    });  
  }

}

