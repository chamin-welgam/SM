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
  selector : 'SM_VD_TextControlProperty',  
  templateUrl: 'SM_VD_TextControlProperty.component.html',
  providers: [ ],
  styleUrls    : [
    './style/index.less',
    './style/patch.less'
  ]
})

export class SM_VD_TextControlPropertyComponent  implements OnInit {
  //variables
  __formNo=0;
  __ID=0;
  __F_NAME="";
  __F_DISPLAY_NAME ="";
  __F_ALLOW_NULL = false;
  __F_LENGTH=100;
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
        var _SP_SM_GET_TEXT_CONTROL=266;
        var _data2={
          F_ID: this.__ID };
        var _callBack_fun2 = showData2.bind(this);
        this.callFunction(_SP_SM_GET_TEXT_CONTROL, _data2, _callBack_fun2);    
          }else{ //error //todo
        alert("Error \nwhile creating text control");
      }  
    }    
    function showData2(_data) {
      if(_data.status=='OK'){
        this.__F_LENGTH =_data.rows[0].c1;
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

  //functions during the web activities
  UpdateProperty(_F_NAME=null , _F_DISPLAY_NAME=null, _F_ALLOW_NULL=null
      , _F_LENGTH=null
      ){
    if (_F_NAME!=null || _F_DISPLAY_NAME != null || _F_ALLOW_NULL!=null){
      var _funNo1 =256;//SP_SM_UPD_FORM_CONTROL
      var _data1={
        F_ID: this.__ID,
        F_NAME:_F_NAME,
        F_DISPLAY_NAME : _F_DISPLAY_NAME,
        F_ALLOW_NULL : _F_ALLOW_NULL
      };
      this.callFunction(_funNo1,_data1,this.updateComplete.bind(this));
    }

    if(_F_LENGTH!=null){
      var _funNo2=258;   //SP_SM_UPD_TEXT_CONTROL
      var _data2={
        F_ID: this.__ID,
        F_LENGTH:_F_LENGTH
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

