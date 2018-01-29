import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';

import * as  AppConfig from  '../configuration/config.json';

@Injectable()
export class TrasactionsReportService {
  serviceUrl =(<any>AppConfig).httpCallPath+ '/api/accounts/getTransactions';
  //  serviceUrl = './api/TransactionReport';
  
  getPage(accountid=1,date1:Date, date2:Date,  pageIndex = 1, pageSize = 10, sortBy, sortOrder) {
    let params = new HttpParams()
      .append('accountid', `${accountid}`)
      .append('date1', `${date1}`)
      .append('date2', `${date2}`)
      .append('pageIndex', `${pageIndex}`)
      .append('pageSize', `${pageSize}`)
      .append('sortBy', sortBy)
      .append('sortOrder', `${sortOrder}`)
      return this.http.get(`${this.serviceUrl}`, {
      params: params
    })
  }

  constructor(private http: HttpClient) {
  }
}

import { Component, OnInit } from '@angular/core';
import { NzSelectComponent } from '../../../index.showcase';
import { NzInputComponent } from '../../../index.showcase';

@Component({
  selector : 'account-transaction-report',  
  templateUrl: 'transactions-report.component.html',
  providers: [ TrasactionsReportService],
  styleUrls    : [
    './style/index.less',
    './style/patch.less'
  ]
})

export class TransactionsReportComponent  implements OnInit {
  __accountID=2;
  __date1= new Date(Date.now()- (90*24*3600000));
  __date2= new Date();
  __currentPage = 1;
  __pageSize = 10;
  __totalPages = 1;
  __totalRecords=1000;
  __dataSet = [];
  __loading = true;
  __listOfAccounts=[];
 
  //search options 
  __searchAccountName;
  __searchDate1;
  __searchDate2;
  __openBalance;
  __endBalance;

  // sort options
  __sortBy="date";
  __sortOrder="ASC";

  getAccountBalance( date, callBack){
    var _url= (<any>AppConfig).httpCallPath+"/api/accounts/getAccountBalance";
    var _params = new HttpParams()
      .append('accountid', `${this.__accountID}`)
      .append('date', `${date}`)
    var _retValue=0;
    this.http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
      if(data.status=='OK'){
        _retValue=data.rows[0].c0; 
        callBack.apply(this,[_retValue]);
      }else{ //error //todo
      }  
    })
  }

  setOpenBalance(value){
    this.__openBalance =value;
  }

  getOpenBalance(){
     this.getAccountBalance(this.__date1, this.setOpenBalance);
  }

  setEndBalance(value){
    this.__endBalance=value;
  }

  getEndBalance(){
    this.getAccountBalance(this.__date2, this.setEndBalance);
 }
 
  getAccounts(){
    var _url= (<any>AppConfig).httpCallPath+"/api/master/getAccountsList";
    var _params = new HttpParams();
    this.http.get(`${_url}`,{}).subscribe((data : any) => {
      if(data.status=='OK'){
        this.__listOfAccounts = data.rows; 
      }else{ //error //todo
      }  
    })
  }

  sort(sortBy, sortOrder) {
    this.__sortBy=sortBy;
    this.__sortOrder=sortOrder=='ascend'?'ASC':'DESC';
    this.refreshData();
  }

  reset() {
    this.refreshData(true);
  }

  __searchCriteriaChanged=true; //to track the accountid is changed

  onDate1Change(dateStr){
    this.__date1=new Date(dateStr);
    this.__searchCriteriaChanged=true;
  }

  onDate2Change(dateStr){
    this.__date2=new Date(dateStr);
    this.__searchCriteriaChanged=true;
  }

  selectedAccountChange($event) {
    if(this.__accountID!=Number($event)){
      this.__accountID= Number($event);
      this.__searchCriteriaChanged=true;
    }
  }

  constructor(private __ReportService: TrasactionsReportService , private http: HttpClient) {
  }

  refreshData(reset = false) {
    if (this.__searchCriteriaChanged){
      this.getOpenBalance();
      this.getEndBalance();
      var _account= (this.__listOfAccounts.find(function (value,index,obj):boolean{
//        return ((value.c0===this.__accountID)? true: false);
        return true;
      },this));
      
      this.__searchAccountName= _account.c1 + ' - '+ _account.c2;
      this.__searchDate1=this.__date1;
      this.__searchDate2= this.__date2;
      this.__searchCriteriaChanged=false;
    }
    if (reset) {
      this.__currentPage = 1;
    }
    this.__loading = true;
    this.__ReportService.getPage(this.__accountID, this.__date1, this.__date2, this.__currentPage, this.__pageSize, this.__sortBy, this.__sortOrder).subscribe((data: any) => {
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
    this.getAccounts();
//    this.refreshData();
  }

}

