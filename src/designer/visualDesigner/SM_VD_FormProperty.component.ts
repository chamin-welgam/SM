import {
  Directive,
  Input,
  HostBinding,
  ElementRef,
  Component, 
  OnInit
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { HttpClient, HttpParams} from '@angular/common/http';
import * as  AppConfig from  '../../app/configuration/config.json';
import { SM_webUtilities } from '../../webUtilities/SM_webUtilities' 
import { now } from 'moment';

@Component({
  selector : 'SM_VD_FormCreator',  
  templateUrl: 'SM_VD_FormProperty.component.html',
  providers: [ ],
  styleUrls    : [
    './style/index.less',
    './style/patch.less'
  ]
})

export class SM_VD_FormPropertyComponent  implements OnInit {
  //variables
  __formNo=0;
  __formName="";
  __title="";
  __el: HTMLElement;
  __SMWU = new SM_webUtilities(this.__http);
  
  constructor(private el: ElementRef,   private __http: HttpClient,
              private __router: Router, private __activatedRouter: ActivatedRoute) {
    this.__el = this.el.nativeElement;
  }

  ngOnInit() {
    this.__activatedRouter.params.subscribe(_param => {
      this.__formNo=_param['id'];
      this.initForm(); 
    });
  }

  //functions for initializing lists 

  //function to initialize form
  initForm(){
    var _data={
      FORM_NO:this.__formNo
    }
    this.__SMWU.callAPIFunction(264, _data, onReceiveData.bind(this));

    function onReceiveData(_data2){
      if(_data2.status=='OK'){
        this.__formName=_data2.rows[0].c1;
        this.__title=_data2.rows[0].c2;
      }else{ //error //todo
        alert("Error \nwhile getting data \nfrom server.");
      }  
    }
  }

  nameChanged(){
    this.UpdateProperty("F_NAME", this.__formName);
  }

  titelChanged(){
    this.UpdateProperty("F_TITLE", this.__title);
  }
  
  //functions during the web activities
  UpdateProperty(_fieldName , _newValue){
    var _url= (<any>AppConfig).httpCallPath+"/api/function";
    var _funNo=253;
    var _data={
        FORM_NO: this.__formNo,
        FIELD_NAME: _fieldName,
        NEW_VALUE: _newValue
      };
    this.__SMWU.callAPIFunction(_funNo,_data,onReceiveData.bind(this));

    function onReceiveData(_data2){
      if(_data2.status=='OK'){
        var x = document.getElementById("__SM_msg");
        x.style.display = "block";
      }else{ //error //todo
        alert("Error \nwhile getting data \nfrom server.");
      }  
    }  
  }

}

