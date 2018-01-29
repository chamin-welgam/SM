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
  
  constructor(private el: ElementRef,   private __http: HttpClient,
              private __router: Router, private __activatedRouter: ActivatedRoute) {
    this.__el = this.el.nativeElement;
  }

  ngOnInit() {
    this.__activatedRouter.params.subscribe(_param => {
      this.__formNo=_param['formNo'];
      this.initForm(); 
    });
    this.newFormData();
  }

  //functions for initializing lists 

  //function to initialize form
  initForm(){

  }
  //function to create new  
  newFormData(){
  }

  //function to save save / save button click
  save(){
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
        FIELD_NAME:_fieldName,
        NEW_VALUE: _newValue
      };
      
    var _params = new HttpParams()
      .append('funNo', `${_funNo}`)
      .append('data', `${JSON.stringify(_data)}`);
    this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
      if(data.status=='OK'){
        var x = document.getElementById("__SM_msg");
        x.style.display = "block";
       }else{ //error //todo
        alert("Error \nwhile getting data \nfrom server.");
      }  
    });  
  }

}

