import {
  Directive,
  Input,
  HostBinding,
  ElementRef
} from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';

import * as  AppConfig from  '../configuration/config.json';

@Component({
  selector : 'SM-%{formName}%',  
  templateUrl: '%{formName}%.component.html',
  providers: [],
  styleUrls    : []
})


export class %{formName}%Component  implements OnInit {
  //variables
  //tabel variables
  __currentPage = 1;
  __pageSize = 10;
  __totalPages = 1;
  __totalRecords=10;
  __dataSet = [];
  __loading = false;
  
  //form data
  %{formVariables}%

  __el: HTMLElement;
  
  constructor(private el: ElementRef,  private __http: HttpClient) {
    this.__el = this.el.nativeElement;
  }

  ngOnInit() {
    %{formInitLists}%
    this.newFormData();
  }

  %{formFunctions}%

  newFormData(){
    %{formNewFormDataFunctionCode}%
  }

  save(){
    var _oldLoadingValue= this.__loading;
    this.__loading=true;
    var _url= (<any>AppConfig).httpCallPath+"/api/function";
    var _funNo=%{saveFunNo}%;
    var _data={
        %{formSaveFunctoinCode}%    
      };
      
    var _params = new HttpParams()
      .append('funNo', `${_funNo}`)
      .append('data', `${JSON.stringify(_data)}`);
    this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
      if(data.status=='OK'){
        this.__loading=_oldLoadingValue;
        alert("SUCCESSFUL.");
        this.newFormData();
      }else{ //error //todo
        alert("Error \nwhile getting data \nfrom server.");
      }  
    });  
  }

}

