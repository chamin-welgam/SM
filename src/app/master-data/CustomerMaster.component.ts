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
  selector : 'SM-CustomerMaster',  
  templateUrl: 'CustomerMaster.component.html',
  providers: [],
  styleUrls    : []
})


export class CustomerMasterComponent  implements OnInit {
  //variables
  //tabel variables
  __currentPage = 1;
  __pageSize = 10;
  __totalPages = 1;
  __totalRecords=10;
  __dataSet = [];
  __loading = false;
  
  //form data
  
	__cd="";
	__nm="";
	__adr="";
	__district="";
	__listOfdistrict=[];
	__area="";
	__listOfarea=[];
	__tel="";
	__mobile="";
	__email="";
	__businessType="";
	__listOfbusinessType=[];
	__AccountID="";
	__listOfAccountID=[];

  __el: HTMLElement;
  
  constructor(private el: ElementRef,  private __http: HttpClient) {
    this.__el = this.el.nativeElement;
  }

  ngOnInit() {
    
		this.getListOfdistrict();
		this.getListOfarea();
		this.getListOfbusinessType();
		this.getListOfAccountID();
    this.newFormData();
  }

  
	getListOfdistrict(){
	  var _url= (<any>AppConfig).httpCallPath+"/api/function";
	  var _data={"enumGrpID":6};
	  var _params = new HttpParams()
	    .append('data',`${JSON.stringify(_data)}`)
	    .append('funNo','9');
	  this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
	    if(data.status=='OK'){
	      this.__listOfdistrict = data.rows; 
	    }
	  })
	}

	getListOfarea(){
	  var _url= (<any>AppConfig).httpCallPath+"/api/function";
	  var _data={"enumGrpID":5};
	  var _params = new HttpParams()
	    .append('data',`${JSON.stringify(_data)}`)
	    .append('funNo','9');
	  this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
	    if(data.status=='OK'){
	      this.__listOfarea = data.rows; 
	    }
	  })
	}

	getListOfbusinessType(){
	  var _url= (<any>AppConfig).httpCallPath+"/api/function";
	  var _data={"enumGrpID":4};
	  var _params = new HttpParams()
	    .append('data',`${JSON.stringify(_data)}`)
	    .append('funNo','9');
	  this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
	    if(data.status=='OK'){
	      this.__listOfbusinessType = data.rows; 
	    }
	  })
	}

	getListOfAccountID(){
	  var _url= (<any>AppConfig).httpCallPath+"/api/function";
	  var _data={"parentAccID":179};
	  var _params = new HttpParams()
	    .append('data',`${JSON.stringify(_data)}`)
	    .append('funNo','5');
	  this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
	    if(data.status=='OK'){
	      this.__listOfAccountID = data.rows; 
	    }
	  })
	}


  newFormData(){
    
		this.__cd="";
		this.__nm="";
		this.__adr="";
		this.__district="";
		this.__area="";
		this.__tel="";
		this.__mobile="";
		this.__email="";
		this.__businessType="";
		this.__AccountID="";
  }

  save(){
    var _oldLoadingValue= this.__loading;
    this.__loading=true;
    var _url= (<any>AppConfig).httpCallPath+"/api/function";
    var _funNo=4;
    var _data={
        
				cd: this.__cd,
				nm: this.__nm,
				adr: this.__adr,
				district: this.__district,
				area: this.__area,
				tel: this.__tel,
				mobile: this.__mobile,
				email: this.__email,
				businessType: this.__businessType,
				AccountID: this.__AccountID,    
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

