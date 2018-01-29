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
export class chequesOnHandComponentService {
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

@Component({
  selector : 'aso-chequesInHand',  
  templateUrl: 'chequesInHand.component.html',
  providers: [ chequesOnHandComponentService],
  styleUrls    : [
    './style/index.less',
    './style/patch.less'
  ]
})

export class chequesInHandComponent  implements OnInit {
  //report variables
  __filerOptions="";
  __currentPage = 1;
  __pageSize = 10;
  __totalPages = 1;
  __totalRecords=1000;
  __dataSet = [];
  __loading = false;
  __sortOrder = 'ASC';
  __sortBy = 'ChqDate';
  
  //search options 
  __searchDate1=new Date( now()-(5*24*60*60*1000));
  __searchDate2=new Date(now()+(30*24*60*60*1000));
  __searchReceived=true;
  __searchDeposit=false;
  __searchReturned=false;
  __searchCleared=false;
  __searchCriteriaChanged=true; //to track the accountid is changed

  __el: HTMLElement;
  
  constructor(private el: ElementRef, private __ReportService: chequesOnHandComponentService , private http: HttpClient) {
    this.__el = this.el.nativeElement;
  }

  onSortChange(sortBy, sortOrder) {
    this.__sortBy=sortBy;
    this.__sortOrder=sortOrder=='ascend'?'ASC':'DESC';
    this.refreshData();
  }

  reset() {
    this.refreshData(true);
  }

  onDate1Change(dateStr){
    this.__searchDate1=new Date(dateStr);
    this.__searchCriteriaChanged=true;
  }

  onDate2Change(dateStr){
    this.__searchDate2=new Date(dateStr);
    this.__searchCriteriaChanged=true;
  }

  refreshData(reset = false) {
    if (this.__searchCriteriaChanged){
      this.__filerOptions=  "Cheques [" +
                            (this.__searchReceived?" Received":"")+
                            (this.__searchDeposit?" Deposit":"")+
                            (this.__searchReturned?" Returned":"")+
                            (this.__searchCleared?" Cleared]":"]")+
                            " from "
                            this.__searchDate1.toUTCString().slice(4,15) + " to "+
                            this.__searchDate2.toUTCString().slice(4,15) + " ";
      this.__searchCriteriaChanged=false;
      reset=true;
    }
    if (reset) {
      this.__currentPage = 1;
    }
    this.__loading = true;
    let _statusFilter=(this.__searchReceived?"Received,":"")+
                        (this.__searchDeposit?"Deposit,":"")+
                        (this.__searchReturned?"Returned,":"")+
                        (this.__searchCleared?"Cleared,":"");    
    _statusFilter = (!_statusFilter)?" ":_statusFilter;
    _statusFilter = _statusFilter.slice(0,_statusFilter.length-1);

    this.__ReportService.getPage( this.__searchDate1, this.__searchDate2, _statusFilter,
                                   this.__currentPage, this.__pageSize, 
                                   this.__sortBy, this.__sortOrder).subscribe((data: any) => {
      this.__loading = false;
      if (data.status=='OK'){
        this.__dataSet = data.rows;        
        this.__totalRecords= data.totalRows;
      }else{
        //todo show error dialog and retry
      }
    })
  };

  ngOnInit() {
//    this.getAccounts();
//    this.refreshData();
  }

}

