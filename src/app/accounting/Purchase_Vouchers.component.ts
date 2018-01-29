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
  selector : 'SM-Purchase_Vouchers',  
  templateUrl: 'Purchase_Vouchers.component.html',
  providers: [],
  styleUrls    : []
})


export class Purchase_VouchersComponent  implements OnInit {
  //variables
  //tabel variables
  __currentPage = 1;
  __pageSize = 10;
  __totalPages = 1;
  __totalRecords=10;
  __dataSet = [];
  __loading = false;
  
  //form data
  
	__VoucherNo="";
	__VoucherDate=Date();
	__TotalAmount=0;
	__SupplierID="";
	__listOfSupplierID=[];
	__BillNo="";
	__ShopName="";

  __el: HTMLElement;
  
  constructor(private el: ElementRef,  private __http: HttpClient) {
    this.__el = this.el.nativeElement;
  }

  ngOnInit() {
    
		this.getListOfSupplierID();
    this.newFormData();
  }

  
	getNextVoucherNo(){
	  var _url= (<any>AppConfig).httpCallPath+"/api/function";
	  var _data={"trn":"PURCHASE"};
	  var _params = new HttpParams()
	    .append('data',`${JSON.stringify(_data)}`)
	    .append('funNo','12');
	  this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
	    if(data.status=='OK'){
	      this.__VoucherNo = data.rows[0].c0; 
	    }
	  })
	}

	getListOfSupplierID(){
	  var _url= (<any>AppConfig).httpCallPath+"/api/function";
	  var _data={};
	  var _params = new HttpParams()
	    .append('data',`${JSON.stringify(_data)}`)
	    .append('funNo','40');
	  this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
	    if(data.status=='OK'){
	      this.__listOfSupplierID = data.rows; 
	    }
	  })
	}


  newFormData(){
    
		this.getNextVoucherNo();
		this.__VoucherDate=Date();
		this.__TotalAmount=0;
		this.__SupplierID="";
		this.__BillNo="";
		this.__ShopName="";
  }

  save(){
    var _oldLoadingValue= this.__loading;
    this.__loading=true;
    var _url= (<any>AppConfig).httpCallPath+"/api/function";
    var _funNo=44;
    var _data={
        
				VoucherNo: this.__VoucherNo,
				VoucherDate: this.__VoucherDate,
				TotalAmount: this.__TotalAmount,
				SupplierID: this.__SupplierID,
				BillNo: this.__BillNo,
				ShopName: this.__ShopName,    
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

