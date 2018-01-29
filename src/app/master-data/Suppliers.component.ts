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
  selector : 'SM-Suppliers',  
  templateUrl: 'Suppliers.component.html',
  providers: [],
  styleUrls    : []
})


export class SuppliersComponent  implements OnInit {
  //variables
  //tabel variables
  __currentPage = 1;
  __pageSize = 10;
  __totalPages = 1;
  __totalRecords=10;
  __dataSet = [];
  __loading = false;
  
  //form data
  
	__code="";
	__name="";
	__Address="";
	__District="";
	__listOfDistrict=[];
	__Area="";
	__listOfArea=[];
	__Tel="";
	__Mobile="";
	__email="";
	__BusinessType="";
	__listOfBusinessType=[];
	__AccountID="";
	__listOfAccountID=[];

  __el: HTMLElement;
  
  constructor(private el: ElementRef,  private __http: HttpClient) {
    this.__el = this.el.nativeElement;
  }

  ngOnInit() {
    
		this.getListOfDistrict();
		this.getListOfArea();
		this.getListOfBusinessType();
		this.getListOfAccountID();
    this.newFormData();
  }

  
	getListOfDistrict(){
	  var _url= (<any>AppConfig).httpCallPath+"/api/function";
	  var _data={"enumGrpID":6};
	  var _params = new HttpParams()
	    .append('data',`${JSON.stringify(_data)}`)
	    .append('funNo','9');
	  this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
	    if(data.status=='OK'){
	      this.__listOfDistrict = data.rows; 
	    }
	  })
	}

	getListOfArea(){
	  var _url= (<any>AppConfig).httpCallPath+"/api/function";
	  var _data={"enumGrpID":5};
	  var _params = new HttpParams()
	    .append('data',`${JSON.stringify(_data)}`)
	    .append('funNo','9');
	  this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
	    if(data.status=='OK'){
	      this.__listOfArea = data.rows; 
	    }
	  })
	}

	getListOfBusinessType(){
	  var _url= (<any>AppConfig).httpCallPath+"/api/function";
	  var _data={"enumGrpID":4};
	  var _params = new HttpParams()
	    .append('data',`${JSON.stringify(_data)}`)
	    .append('funNo','9');
	  this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
	    if(data.status=='OK'){
	      this.__listOfBusinessType = data.rows; 
	    }
	  })
	}

	getListOfAccountID(){
	  var _url= (<any>AppConfig).httpCallPath+"/api/function";
	  var _data={"parentAccID":197};
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
    
		this.__code="";
		this.__name="";
		this.__Address="";
		this.__District="";
		this.__Area="";
		this.__Tel="";
		this.__Mobile="";
		this.__email="";
		this.__BusinessType="";
		this.__AccountID="";
  }

  save(){
    var _oldLoadingValue= this.__loading;
    this.__loading=true;
    var _url= (<any>AppConfig).httpCallPath+"/api/function";
    var _funNo=29;
    var _data={
        
				code: this.__code,
				name: this.__name,
				Address: this.__Address,
				District: this.__District,
				Area: this.__Area,
				Tel: this.__Tel,
				Mobile: this.__Mobile,
				email: this.__email,
				BusinessType: this.__BusinessType,
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

