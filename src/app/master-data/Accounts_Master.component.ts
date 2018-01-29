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
  selector : 'SM-Accounts_Master',  
  templateUrl: 'Accounts_Master.component.html',
  providers: [],
  styleUrls    : []
})


export class Accounts_MasterComponent  implements OnInit {
  //variables
  //tabel variables
  __currentPage = 1;
  __pageSize = 10;
  __totalPages = 1;
  __totalRecords=10;
  __dataSet = [];
  __loading = false;
  
  //form data
  
	__AccCd="";
	__AccNm="";
	__ParentAccID="";
	__listOfParentAccID=[];

  __el: HTMLElement;
  
  constructor(private el: ElementRef,  private __http: HttpClient) {
    this.__el = this.el.nativeElement;
  }

  ngOnInit() {
    
		this.getListOfParentAccID();
    this.newFormData();
  }

  
	getListOfParentAccID(){
	  var _url= (<any>AppConfig).httpCallPath+"/api/function";
	  var _data={"parentAccID":null};
	  var _params = new HttpParams()
	    .append('data',`${JSON.stringify(_data)}`)
	    .append('funNo','5');
	  this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
	    if(data.status=='OK'){
	      this.__listOfParentAccID = data.rows; 
	    }
	  })
	}


  newFormData(){
    
		this.__AccCd="";
		this.__AccNm="";
		this.__ParentAccID="";
  }

  save(){
    var _oldLoadingValue= this.__loading;
    this.__loading=true;
    var _url= (<any>AppConfig).httpCallPath+"/api/function";
    var _funNo=22;
    var _data={
        
				AccCd: this.__AccCd,
				AccNm: this.__AccNm,
				ParentAccID: this.__ParentAccID,    
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

