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
  selector : 'SM-ReceiptVoucher',  
  templateUrl: 'ReceiptVoucher.component.html',
  providers: [],
  styleUrls    : []
})


export class ReceiptVoucherComponent  implements OnInit {
  //variables
  //tabel variables
  __currentPage = 1;
  __pageSize = 10;
  __totalPages = 1;
  __totalRecords=10;
  __dataSet = [];
  __loading = false;
  
  //form data
  
	__VOUCHER_NO="";
	__VOUCHER_DATE=Date();
	__RECEIVED_BY_ACC_ID="";
	__listOfRECEIVED_BY_ACC_ID=[];
	__AMOUNT=0;
	__IS_CASH_RECEIPT=0;
	__options_IS_CASH_RECEIPT=[{"display":"CASH","value":1},{"display":"CHEQUE","value":0}];
	__RECEIVED_TO_ACC_ID="";
	__listOfRECEIVED_TO_ACC_ID=[];
	__CHEQUE_NO="";
	__CHEQUE_DATE=Date();
	__DESCRIPTION="";

  __el: HTMLElement;
  
  constructor(private el: ElementRef,  private __http: HttpClient) {
    this.__el = this.el.nativeElement;
  }

  ngOnInit() {
    
		this.getListOfRECEIVED_BY_ACC_ID();
		this.getListOfRECEIVED_TO_ACC_ID();
    this.newFormData();
  }

  
	getNextVOUCHER_NO(){
	  var _url= (<any>AppConfig).httpCallPath+"/api/function";
	  var _data={"trn":"RECEIPT"};
	  var _params = new HttpParams()
	    .append('data',`${JSON.stringify(_data)}`)
	    .append('funNo','12');
	  this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
	    if(data.status=='OK'){
	      this.__VOUCHER_NO = data.rows[0].c0; 
	    }
	  })
	}

	getListOfRECEIVED_BY_ACC_ID(){
	  var _url= (<any>AppConfig).httpCallPath+"/api/function";
	  var _data={"parentAccID":179};
	  var _params = new HttpParams()
	    .append('data',`${JSON.stringify(_data)}`)
	    .append('funNo','5');
	  this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
	    if(data.status=='OK'){
	      this.__listOfRECEIVED_BY_ACC_ID = data.rows; 
	    }
	  })
	}

	getListOfRECEIVED_TO_ACC_ID(){
	  var _url= (<any>AppConfig).httpCallPath+"/api/function";
	  var _data={"parentAccID":179};
	  var _params = new HttpParams()
	    .append('data',`${JSON.stringify(_data)}`)
	    .append('funNo','5');
	  this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
	    if(data.status=='OK'){
	      this.__listOfRECEIVED_TO_ACC_ID = data.rows; 
	    }
	  })
	}


  newFormData(){
    
		this.getNextVOUCHER_NO();
		this.__VOUCHER_DATE=Date();
		this.__RECEIVED_BY_ACC_ID="";
		this.__AMOUNT=0;
		this.__IS_CASH_RECEIPT=0;
		this.__RECEIVED_TO_ACC_ID="";
		this.__CHEQUE_NO="";
		this.__CHEQUE_DATE=Date();
		this.__DESCRIPTION="";
  }

  save(){
    var _oldLoadingValue= this.__loading;
    this.__loading=true;
    var _url= (<any>AppConfig).httpCallPath+"/api/function";
    var _funNo=137;
    var _data={
        
				VOUCHER_NO: this.__VOUCHER_NO,
				VOUCHER_DATE: this.__VOUCHER_DATE,
				RECEIVED_BY_ACC_ID: this.__RECEIVED_BY_ACC_ID,
				AMOUNT: this.__AMOUNT,
				IS_CASH_RECEIPT: this.__IS_CASH_RECEIPT,
				RECEIVED_TO_ACC_ID: this.__RECEIVED_TO_ACC_ID,
				CHEQUE_NO: this.__CHEQUE_NO,
				CHEQUE_DATE: this.__CHEQUE_DATE,
				DESCRIPTION: this.__DESCRIPTION,    
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

