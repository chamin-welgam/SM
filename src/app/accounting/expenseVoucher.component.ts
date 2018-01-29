import {
  Directive,
  Input,
  HostBinding,
  ElementRef
} from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';

import * as  AppConfig from  '../configuration/config.json';

@Injectable()
export class expenseVoucherComponentService {
  serviceUrl =(<any>AppConfig).httpCallPath+ '/api/accounts/getChequesInHand';
  
  getPage(date1:Date, date2:Date, statusFilter="", pageIndex = 1, pageSize = 10, sortBy, sortOrder) {
    let params = new HttpParams()
      .append('date1', `${date1}`)
      .append('date2', `${date2}`)
      .append('statusFilter',`${statusFilter}`)
      .append('pageIndex', `${pageIndex}`)
      .append('pageSize', `${pageSize}`)
      .append('sortBy', `${sortBy}`)
      .append('sortOrder', `${sortOrder}`)
      return this.http.get(`${this.serviceUrl}`, {
      params: params
    })
  }

  constructor(private http: HttpClient) {
  }
}

import { Component, OnInit } from '@angular/core';
import { now } from 'moment';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector : 'aso-expenseVoucher',  
  templateUrl: 'expenseVoucher.component.html',
  providers: [ expenseVoucherComponentService],
  styleUrls    : [
    './style/index.less',
    './style/patch.less'
  ]
})

export class expenseVoucherComponent  implements OnInit {
  //variables
  //tabble variables
  __currentPage = 1;
  __pageSize = 50;
  __totalPages = 1;
  __totalRecords=50;
  __dataSet = [];
  __loading = false;
  
  //voucher data
  __voucherDate=new Date( );
  __voucherNo="";
  __creditAccountID=0;  
  __totalAmount=0;    // vaoucher amount
  __voucherDescription;
  // expenses
  __drTrans=[];    //bound to table

  //accounts list
  __listOfAccounts=[];

  __el: HTMLElement;
  
  constructor(private el: ElementRef,  private __http: HttpClient) {
    this.__el = this.el.nativeElement;
  }

  ngOnInit() {
    this.getAccounts();
    this.newVoucher();
  }
    
  getAccounts(){
    var _url= (<any>AppConfig).httpCallPath+"/api/master/getAccountsList";
    var _params = new HttpParams();
    this.__http.get(`${_url}`,{}).subscribe((data : any) => {
      if(data.status=='OK'){
        this.__listOfAccounts = data.rows; 
      }else{ //error //todo
      }  
    })
  }
  
  getNextVoucherNumber(){
    var _oldLoadingValue= this.__loading;
    this.__loading=true;
    var _url= (<any>AppConfig).httpCallPath+"/api/accounts/getNextExpenseVoucherNo";
    this.__http.get(`${_url}`,{}).subscribe((data : any) => {
      if(data.status=='OK'){
        this.__voucherNo = data.rows[0].c0; 
      }else{ //error //todo
        this.__voucherNo='ERROR';
        alert("Error received \nwhile getting data \nfrom server.");
      }  
    })
    this.__loading=_oldLoadingValue;    
  }

  newVoucher(){
    this.__voucherDescription="";
    this.getNextVoucherNumber();
    this.__totalAmount=0;
    this.__drTrans=[];
    for (let i_ = 0; i_ < 20; i_++) {
      this.__drTrans.push({accID:0, desc:"", amt:0}) 
    } 
  }

  save(){
    var _oldLoadingValue= this.__loading;
    this.__loading=true;
    var _url= (<any>AppConfig).httpCallPath+"/api/accounts/addExpenseVoucher";
    var _voucher={
      vchNo: this.__voucherNo,
      vchDate: this.__voucherDate,
      vchCrAccID: this.__creditAccountID,
      vchCrAmt: this.__totalAmount,
      vchDes:this.__voucherDescription,
      drTrans:[]
    }
    this.__drTrans.forEach((exp)=>{
      if(exp.amt>0){
        _voucher.drTrans.push(exp);
      }
    });
    var _params = new HttpParams()
      .append('voucher', `${JSON.stringify(_voucher)}`);
    this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
      if(data.status=='OK'){
        this.__loading=_oldLoadingValue;
        alert("SUCCESSFUL.");
        this.newVoucher();
      }else{ //error //todo
        this.__voucherNo='ERROR';
        alert("Error \nwhile getting data \nfrom server.");
      }  
    })  
  }

  recalc(amt, expense){
    expense.amt=amt;
    let _totAmt=0;
    this.__drTrans.forEach((exp)=>{
      _totAmt+= exp.amt;    
    });
    this.__totalAmount=_totAmt;
  }

}

