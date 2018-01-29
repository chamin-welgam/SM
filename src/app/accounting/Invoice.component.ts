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
  selector : 'SM-Invoice',  
  templateUrl: 'Invoice.component.html',
  providers: [],
  styleUrls    : []
})


export class InvoiceComponent  implements OnInit {
  //variables
  //tabel variables
  __currentPage = 1;
  __pageSize = 10;
  __totalPages = 1;
  __totalRecords=10;
  __dataSet = [];
  __loading = false;
  
  //form data
  
	__Date=Date();
	__InvoiceNo="";
	__manualInvNo="";
	__CustomerID="";
	__listOfCustomerID=[];
	__Amount=0;
	__canceled=0;
	__options_canceled=[{"display":"CANCELED","value":1},{"display":"VALID INVOICE","value":0}];
	__canceledDate=Date();
	__canceledReason="";

  __el: HTMLElement;
  
  constructor(private el: ElementRef,  private __http: HttpClient) {
    this.__el = this.el.nativeElement;
  }

  ngOnInit() {
    
		this.getListOfCustomerID();
    this.newFormData();
  }

  
	getNextInvoiceNo(){
	  var _url= (<any>AppConfig).httpCallPath+"/api/function";
	  var _data={"trn":"INVOICE"};
	  var _params = new HttpParams()
	    .append('data',`${JSON.stringify(_data)}`)
	    .append('funNo','12');
	  this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
	    if(data.status=='OK'){
	      this.__InvoiceNo = data.rows[0].c0; 
	    }
	  })
	}

	getListOfCustomerID(){
	  var _url= (<any>AppConfig).httpCallPath+"/api/function";
	  var _data={};
	  var _params = new HttpParams()
	    .append('data',`${JSON.stringify(_data)}`)
	    .append('funNo','16');
	  this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
	    if(data.status=='OK'){
	      this.__listOfCustomerID = data.rows; 
	    }
	  })
	}


  newFormData(){
    
		this.__Date=Date();
		this.getNextInvoiceNo();
		this.__manualInvNo="";
		this.__CustomerID="";
		this.__Amount=0;
		this.__canceled=0;
		this.__canceledDate=Date();
		this.__canceledReason="";
  }

  save(){
    var _oldLoadingValue= this.__loading;
    this.__loading=true;
    var _url= (<any>AppConfig).httpCallPath+"/api/function";
    var _funNo=34;
    var _data={
        
				Date: this.__Date,
				InvoiceNo: this.__InvoiceNo,
				manualInvNo: this.__manualInvNo,
				CustomerID: this.__CustomerID,
				Amount: this.__Amount,
				canceled: this.__canceled,
				canceledDate: this.__canceledDate,
				canceledReason: this.__canceledReason,    
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

