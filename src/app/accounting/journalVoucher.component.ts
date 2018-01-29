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
export class getAccountsListService {
  serviceUrl =(<any>AppConfig).httpCallPath+ '/api/master/getAccountsList';
  
  getAccountsList() {
    let params = new HttpParams();
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
  templateUrl: 'journalVoucher.component.html',
  providers: [ getAccountsListService],
  styleUrls    : [
    './style/index.less',
    './style/patch.less'
  ]
})

export class journalVoucherComponent  implements OnInit {
  //variables
  //tabble variables
  __currentPage = 1;
  __pageSize = 20;
  __totalPages = 1;
  __totalRecords=20;
  __dataSet = [];
  __loading = false;
  
  //voucher data
  __voucherDate=new Date( );
  __voucherNo="";
  __crAmt=0;    
  __drAmt=0;    
  __voucherDescription;
  __trans=[];    //bound to table

  //accounts list
  __listOfAccounts=[];

  __el: HTMLElement;
  
  constructor(private el: ElementRef,  private __http: HttpClient,
      private __getAccLstSrv: getAccountsListService ) {
    this.__el = this.el.nativeElement;
  }

  ngOnInit() {
    this.getAccounts();
    this.newVoucher();
  }
    
  getAccounts(){
    this.__getAccLstSrv.getAccountsList().subscribe((data : any) => {
      if(data.status=='OK'){
        this.__listOfAccounts = data.rows; 
      }else{ //error //todo
      }  
    });
    
/*     var _url= (<any>AppConfig).httpCallPath+"/api/master/getAccountsList";
    var _params = new HttpParams();
    this.__http.get(`${_url}`,{}).subscribe((data : any) => {
      if(data.status=='OK'){
        this.__listOfAccounts = data.rows; 
      }else{ //error //todo
      }  
    })
 */
  }
  
  getNextVoucherNumber(){
    var _oldLoadingValue= this.__loading;
    this.__loading=true;
    var _url= (<any>AppConfig).httpCallPath+"/api/accounts/getNextJournalVoucherNo";
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
    this.__crAmt=0;
    this.__drAmt=0;
    this.__trans=[];
    for (let i_ = 0; i_ < 20; i_++) {
      this.__trans.push({accID:0, des:"", crAmt:0, drAmt:0}) ;
    } 
  }

  save(){
    var _oldLoadingValue= this.__loading;
    this.__loading=true;
    var _url= (<any>AppConfig).httpCallPath+"/api/accounts/addJournalVoucher";
    var _voucher={
      no: this.__voucherNo,
      date: this.__voucherDate,
      des:this.__voucherDescription,
      trans:[]
    }
    this.__trans.forEach((_trn)=>{
      if(_trn.crAmt>0 || _trn.drAmt>0){
        _voucher.trans.push(_trn);
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

  recalc(amt, tran, isDR){
    if(isDR){
      tran.drAmt=amt;
      //tran.crAmt= (amt===0?100 : 0);
    } else {
      tran.crAmt=amt;
      //tran.drAmt=(amt==0?100:0);
    }
    let _crAmt=0;
    let _drAmt=0;    
    this.__trans.forEach((_tran)=>{
      _crAmt= _crAmt+ _tran.crAmt;    
      _drAmt= _drAmt+ _tran.drAmt;    
    });
    this.__crAmt=_crAmt;
    this.__drAmt=_drAmt;
  }

}

