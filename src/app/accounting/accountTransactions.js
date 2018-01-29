//
//  Name:   accountTransaction class
//
//  Description:
//    functions will call the baseView getData(); 
//    ultimatly will return the result in JSON string in response object
//    for the format for return object refer baseView.sendResponse()
//
//  functions:
//    getTransactions     returns the account transactions 
//    getAccountBalance   returns the account balance
//    getChequesInHand    returns cheques in hand
//    addExpenseVoucher
//    addPurchaseVoucher
//    addJournalVoucher
//    addVoucher          add voucher data to journal voucher and accounttransactions
//    addReceiptVoucher
//    addPaymentVoucher
//

baseSendData =require( "../framework/baseSendData.js");    //super class
frameworkAPI = require( "../framework/frameworkAPI.js");    //super class

class accountTransactions extends baseSendData{

  constructor (req, res){
    super(req,res);
    this.__class =this;
  }

  //
  //  name: getTransactions
  //
  //  description:
  //    returns account Transactions 
  //
  //  parameters are in url
  //    accountid   
  //    date1               -- start date
  //    date2               -- end date 
  //
  //  return:   
  //    account transactions 
  //  
  getTransactions (){
    var __accountID=this.__req.query.accountid;
    var __date1 = new Date(this.__req.query.date1);
    var __date2 = new Date(this.__req.query.date2);
    var __this =this;     //this class/object it self
    
    console.log('debug:: getTransactions -- ');
    console.log('debug:: url ::'+this.__req.url);
    console.log('debug:: accountid::'+ this.__req.query.accountid);
    console.log('debug:: date1::'+ this.__req.query.date1);
    console.log('debug:: date2::'+ this.__req.query.date2);
    console.log('debug:: pageindex::'+ this.__req.query.pageIndex);
    console.log('debug:: pagesize::'+ this.__req.query.pageSize);
    console.log('debug:: sort by::'+ this.__sortBy);
    console.log('debug:: sort order::'+ this.__sortOrder);
    
    //validate parametes

    this.__sortBy = (typeof this.__sortBy==='undefined'?"date":this.__sortBy);

    if( ( __date1 == "Invalid Date")  || ( __date2 == "Invalid Date")    
    || ( !(__accountID>0))  || (!(this.__pageIndex>0) )
    || ( !(this.__pageSize>0))  )    {
                  
      this.__status='error';
      this.sendResponse();
      return;
    }    

    //setting up the SQL
    this.__recordCountSQL= getRecordsCountSQL();
    this.__getRecordsSQL=getRecordsSQL();
    this.getData( );

    function getRecordsCountSQL(){
        //get Records Count
      var _sql =
      "   select  count(*)"+
      "   FROM "+
      "     AccountTransactions "+
      "   WHERE "+
      "     AccountID= "+ __accountID +
      "     and [Date] between '"+__date1.toISOString() +"' and '" + __date2.toISOString() +"'";
      return _sql;
    }

    function getRecordsSQL() {
      var _startRowNumber = ((__this.__pageIndex-1) * __this.__pageSize)+1;
      var _endRowNumber = (_startRowNumber -1) + Number(__this.__pageSize);
      
      var _sql =
      "with mytbl as "+
      "(   "+
      "   select  "+
      "     ROW_NUMBER() over (order by (["+__this.__sortBy+"]) "+ __this.__sortOrder + ") as '_Row_number',"+
      "     RecordID, AccountID, [Date], Description, VoucherNo, "+
      "     TransactionType, Amount , TransactionID "+
      "   FROM "+
      "     AccountTransactions "+
      "   WHERE "+
      "     AccountID= "+ __accountID +
      "     and [Date] between '"+__date1.toISOString() +"' and '" +__date2.toISOString() +"'"+
      " ) "+
      " select "+
      " RecordID, AccountID, [Date], Description, VoucherNo, "+
      " TransactionType, Amount, TransactionID "+
      " from mytbl where _ROW_NUMBER between "+ _startRowNumber + " and " +_endRowNumber+" "+
      " order by (["+__this.__sortBy+"]) "+ __this.__sortOrder ;
      return _sql;
    } 
  }

  //
  //  name: getAccountBalance
  //
  //  description:
  //    returns account balance 
  //
  //  parameters are in url
  //    accountid   
  //    date              -- balance as of date
  //
  //  return:   
  //    account balance 
  // 
  getAccountBalance (){
    var __accountID=this.__req.query.accountid;
    var __date = new Date(this.__req.query.date);
    var __this =this;     //this class/object it self
    
    console.log('debug:: url ::'+this.__req.url);
    console.log('debug:: accountid::'+ this.__req.query.accountid);
    console.log('debug::'+ this.__req.query.date);

    //validate parametes
    if( ( __date == "Invalid Date")    || ( !(__accountID>0))) {
      this.__status='error';
      this.sendResponse();
      return;
    }    
    //setting up the SQL
    this.__recordCountSQL= getRecordsCountSQL();
    this.__getRecordsSQL=getRecordsSQL();
    this.getData( );

    function getRecordsCountSQL(){
        //get Records Count
      var _sql="";  
      return _sql;
    }

    function getRecordsSQL() {
      var _sql =
      "   select  "+
      "     sum(amount) balance"+
      "   FROM "+
      "     AccountTransactions "+
      "   WHERE "+
      "     AccountID= "+ __accountID +
      "     and [Date] <='"+__date.toISOString('dd-MMM-YYYY') +"'";
      return _sql;
    }


  }

  //
  //  name: getChequesInHand
  //
  //  description:
  //    returns cheque details 
  //
  //  parameters are in url
  //    date1               -- start date
  //    date2               -- end date 
  //    statusFilter       -- filer for status RECEIVED, DEPOSIT, RETURNED, CLEARED
  //
  //  return:   
  //    cheque details 
  // 
  getChequesInHand (){
    var __statusFilter  =this.__req.query.statusFilter;
    var __date1 = new Date(this.__req.query.date1);
    var __date2 = new Date(this.__req.query.date2);
    var __this =this;     //this class/object it self

    console.log('debug:: /api/chequesInHand page hit');
    console.log('debug:: url ::'+this.__req.url);
    console.log('debug::'+ this.__req.query.date1);
    console.log('debug::'+ this.__req.query.date2);
    console.log('debug:: pageindex::'+ this.__req.query.pageIndex);
    console.log('debug::pagesize::'+ this.__req.query.pageSize);
    console.log('debug:: sort by::'+ this.__req.query.sortBy);
    console.log('debug::sort order::'+ this.__req.query.sortOrder);
    console.log('debug::status filter::'+ this.__req.query.statusFilter);
    
    //set defalut if value is not passed  
    this.__sortBy = (typeof this.__sortBy==='undefined'?"chqDate":this.__sortBy);
    if(__statusFilter){
      let _filterValues= __statusFilter.split(",");
      __statusFilter="";
      _filterValues.forEach((value,index)=>{
          __statusFilter+= "'" + value+"',"; 
          });
      __statusFilter= __statusFilter.slice(0,__statusFilter.length-1);
    }else{
      __statusFilter="' '";
    }
    console.log('debug:: sortby:: '+ this.__sortBy);
    console.log('debug:: date1:: ' + __date1.toISOString());

    //validate parametes
    if( ( __date1 == "Invalid Date")  || ( __date2 == "Invalid Date")    
        || (!(this.__pageIndex>0) ) || ( !(this.__pageSize>0))  )    {
        
          this.__status='error';
      this.sendResponse();
      return;
    }    
    //setting up the SQL

    this.__recordCountSQL= getRecordsCountSQL();
    this.__getRecordsSQL=getRecordsSQL();
    this.getData( );

    function getRecordsCountSQL(){
      //get Records Count
      var _sql =
      "   select  count(*)"+
      "   FROM "+
      "     [viewCheques] "+
      "   WHERE "+
      "     status  in("+ __statusFilter +")"+
      "     and [ChqDate] between '"+__date1.toISOString() +"' and '" + __date2.toISOString() +"'";

      return _sql;
    }

    function getRecordsSQL() {
      var _startRowNumber = ((__this.__pageIndex-1) * __this.__pageSize)+1;
      var _endRowNumber = (_startRowNumber -1) + Number(__this.__pageSize);
      
      var _sql =
      "with mytbl as "+
      "(   "+
      "   select  "+
      "     ROW_NUMBER() over (order by (["+__this.__sortBy+"]) "+ __this.__sortOrder + ") as '_Row_number',"+
      "     * "+
      "   FROM "+
      "     viewCheques "+
      "   WHERE "+
      "     status in("+ __statusFilter +")"+
      "     and [ChqDate] between '"+__date1.toISOString() +"' and '" + __date2.toISOString() +"'"+
      " ) "+
      " select "+
      "   Id, ChqNo, ChqBankName, ChqDate, ChqAmount, Status, DepositDate, ClearedDate, ReturnedDate,"+
      "   CustomerCode, Voucher, BankAccount "+
      " from mytbl where _ROW_NUMBER between "+ _startRowNumber + " and " + _endRowNumber+" "+
      " order by (["+__this.__sortBy+"]) "+ __this.__sortOrder ;

      return _sql;
    }
  }

  //
  //  name: addExpenseVoucher
  //
  //  description:
  //    add expense voucher into system  
  //
  //  parameters are in url
  //    voucher={vchNo: string,   vchDate: Date,    vchCrAccID: number,   vchCrAmt: number,
  //              vchDes:string,
  //              drTrans:[{{accID:number, desc:string, amt:number}] }
  //
  //  return:   
  //    OK == successful.    ERROR = failed 
  // 
  addExpenseVoucher(){
    var __this =this;     //this class/object it self
    var __voucher=JSON.parse(this.__req.query.voucher);    //read the voucher
    
    console.log('debug:: addExpenseVoucher function');
    console.log('debug:: url ::'+this.__req.url);
    console.log('debug:: voucher ::'+JSON.stringify( __voucher));
    
    //todo - SQL cleanning

    //validate parametes
    if( (!__voucher)
        || ( !__voucher.vchNo)   
        || ( __voucher.vchDate == "Invalid Date")   
        || ( !(__voucher.vchCrAmt>0))
        || ( !(__voucher.vchCrAccID>0))
        || ( !(__voucher.vchDes))
      ) {
      this.__status='error';
      this.sendResponse();
      return;
    }    

    //create new voucher object to pass to addVoucher function
    var __trns =[];
    __voucher.drTrans.forEach((_trn) => {
        __trns.push( new tranObject(_trn.accID, _trn.desc, _trn.amt ,0 ) );      
      });
    __trns.push(new tranObject(__voucher.vchCrAccID, __voucher.vchDes, 0, __voucher.vchCrAmt));
    var __expVch = new voucherObject(__voucher.vchNo, __voucher.vchDate,
           __voucher.vchDes, "CSHEXP", __trns);                    
    //todo  -begin transaction
    var __stepNumber=1;        
    this.addVoucher(__expVch, onComplete.bind(this));

    function onComplete(responseObj){
      if (responseObj.status=='OK'){
        if (__stepNumber==1){
        // update next  number
          var _frameworkAPI = new frameworkAPI(this.__req, this.__res);
          _frameworkAPI.setNextExpenseVoucherNo(onComplete.bind(this)); 
          __stepNumber=2;    
        }else {
          //step 2
          //commit transactions //todo
          this.__res.send(JSON.stringify(responseObj))          
        }
      }else{
        //rollback db transactions //todo
        this.__res.send(JSON.stringify(responseObj))          
      }
    }
  }
 
  //
  //  name: addPurchaseVoucher
  //
  //  description:
  //    add purchase voucher into system  
  //
  //  parameters are in url
  //    voucher={vchNo: string,   vchDate: Date,    vchCrAccID: number,   vchCrAmt: number,
  //              vchDes:string,
  //              drTrans:[{{accID:number, desc:string, amt:number}] }
  //
  //  return:   
  //    OK == successful.    ERROR = failed 
  // 
  addPurchaseVoucher(){
    var __this =this;     //this class/object it self
    var __pur=this.__req.query.voucher;    

    console.log('debug:: url ::'+this.__req.url);
    __pur=JSON.parse(__pur);
    console.log('debug:: purchase ::'+JSON.stringify( __pur));
    
    //validate parametes
    if( (!__pur)
        || ( !__pur.no)   
        || ( __pur.date == "Invalid Date")   
        || ( !(__pur.amt>0))
        || ( !(__pur.supID>=0))
      ) {
      this.__status='error';
      this.sendResponse();
      return;
    }    
    
    //begin transaction //todo
    var __frameworkAPI = new frameworkAPI(this.__req, this.__res);    
    //setting up the SQL
    this.StoredProcName= "[sp_AddPurchase]";

    this.addInParameter("No", "varchar", __pur.no);
    this.addInParameter("Date", "SmallDateTime", __pur.date);
    this.addInParameter("SupID", "smallInt", __pur.supID);
    this.addInParameter("Amt", "money", __pur.amt);
    this.addInParameter("Desc", "varchar", __pur.desc);
    this.addInParameter("BillNo", "varchar", __pur.billNo);
    this.addInParameter("isCash", "bit", __pur.isCash);
    this.addInParameter("cashAccID", "smallint", __pur.cashAccID);
    this.__sendResponseCallback=sendResponse;
    var __stepNumber=1;    
    this.getData();

    function sendResponse(responseObj)    {
      if (responseObj.status=='OK'){
        if(__stepNumber==1){
          // update next inv number
          __frameworkAPI.setNextPurchaseVoucherNo(sendResponse);    
          __stepNumber=2;    
        }else {
          //step 2
          //commit transactions //todo
          this.__res.send(JSON.stringify(responseObj))          
        }

      }else{
        //rollback db transactions //todo
        this.__res.send(JSON.stringify(responseObj))          
      }
    }
  }  

  //
  //  name: addJournalVoucher
  //
  //  description:
  //    add journal voucher into system  
  //
  //  parameters are in url
  //    voucher={no: string,   date: Date,    des:string,
  //              trans:[{accID:number, desc:string, drAmt:number, crAmt:number}] }
  //
  //  return:   
  //    OK == successful.    ERROR = failed 
  // 
  addJournalVoucher(){
    var __this =this;     //this class/object it self
    var __jnl=this.__req.query.voucher;    

    console.log('debug:: url ::'+this.__req.url);
    __jnl=JSON.parse(__jnl);
    console.log('debug:: jnl ::'+JSON.stringify( __jnl));

    //SQL cleanning    //todo

    //validate parametes
    if( (!__jnl)
        || ( !__jnl.no)   
        || ( __jnl.date == "Invalid Date")   
        || ( !__jnl.des)
        || ( !__jnl.trans)
        || ( !__jnl.trans.length>0)
      ) {
      this.__status='error';
      this.sendResponse();
      return;
    }    else{
      var _crTotAmt=0;
      var _drTotAmt=0;
      __jnl.trans.forEach((trn)=>{
        _drTotAmt+= trn.drAmt;
        _crTotAmt+= trn.crAmt;
      }); 
      if (_crTotAmt!=_drTotAmt){
        this.__status='error';
        this.sendResponse();
        return;
      }
    }
    
    __jnl.tranType="PUR";
    //begin transaction //todo
    var __stepNumber=1;
    this.addVoucher(__jnl, onComplete.bind(this));

    function onComplete(responseObj){
      if (responseObj.status=='OK'){
        if (__stepNumber==1){
        // update next  number
          var _frameworkAPI = new frameworkAPI(this.__req, this.__res);    
          _frameworkAPI.setNextJournalVoucherNo(onComplete.bind(this)); 
          __stepNumber=2;    
        }else {
          //step 2
          //commit transactions //todo
          this.__res.send(JSON.stringify(responseObj))          
        }
      }else{
        //rollback db transactions //todo
        this.__res.send(JSON.stringify(responseObj))          
      }
    }
  } 


  //
  //  name: addVoucher
  //
  //  description:
  //    add purchase voucher into system   
  //    private function should call from internal functions only
  //
  //  parameters 
  //    voucher={no: string,   date: Date,    des:string,    tranType: string,
  //              trans:[{accID:number, des:string, drAmt:number, crAmt:number}] }
  //
  //  return:   
  //    resultObject ,status=   OK == successful.    ERROR = failed  on response
  // 
  addVoucher(voucher, onCompleteCallBack){
    var __voucher=voucher;
    
    console.log('debug:: addVoucher function');
    console.log('debug:: voucher ::'+JSON.stringify( __voucher));
    
    //SQL cleanning -- no need , since this called by internal assumption is it is clean        
    //validate parametes  -- assumption is it is validated
    
    //setting up the SQL
    this.clearParameters();
    this.StoredProcName= "[sp_AddJournalEntry]";
    this.addInParameter("vchNo", "varchar", __voucher.no);
    this.addInParameter("vchDate", "SmallDateTime", __voucher.date);
    this.addInParameter("vchDesc", "varchar", __voucher.des);
    this.addInParameter("vchTransType", "varchar", __voucher.tranType);
    
    this.__sendResponseCallback=sendResponse;
    var __stepNumber=1;    
    this.getData();

    var __vchRecID=0;
    var __vchTrnRowNum=-1;

    function sendResponse(responseObj)    {
      console.log('debug:: responseObj ::' +JSON.stringify(responseObj));
      if (responseObj.status=='OK'){
        if(__stepNumber==1){
          if (__vchTrnRowNum==-1){
            //get voucher record id
            __vchRecID    = responseObj.rows[0].c0;
          }
          //Cr transaction 
          __vchTrnRowNum++;
          this.clearParameters();
          this.StoredProcName= "[sp_AddAccountTransaction]";
          this.addInParameter("trnVchNo", "varchar", __voucher.no);
          this.addInParameter("trnDate", "SmallDateTime", __voucher.date);
          this.addInParameter("trnDesc", "varchar", __voucher.trans[__vchTrnRowNum].des);
          this.addInParameter("trnAccID", "smallint", __voucher.trans[__vchTrnRowNum].accID);
          this.addInParameter("trnType ", "varchar", __voucher.tranType);
          this.addInParameter("trnID", "int", __vchRecID);
          if (__voucher.trans[__vchTrnRowNum].drAmt>0){
            this.addInParameter("trnAmt", "money", __voucher.trans[__vchTrnRowNum].drAmt);
          }else{
            this.addInParameter("trnAmt", "money", __voucher.trans[__vchTrnRowNum].crAmt * -1);
          }
          this.__sendResponseCallback=sendResponse;
          if(__vchTrnRowNum== __voucher.trans.length-1){
            __stepNumber=2;
          }else{
            __stepNumber=1;    
          }
          this.getData();
        }else if (__stepNumber==2){
          onCompleteCallBack({status:"OK"});
        }
      }else{
        //rollback db transactions //todo
        onCompleteCallBack({status:"ERROR"});
      }
    }
  } 

  //
  //  name: addReceiptVoucher
  //
  //  description:
  //    add receipt voucher into system  
  //
  //  parameters are in url
  //    voucher={No: string,   dt: Date,    cusAccID: number,   amt: number,
  //             chqNo: string, chqDt:date  chqBank: string }
  //
  //  return:   
  //    OK == successful.    ERROR = failed 
  // 
  addReceiptVoucher(){
    var __this =this;     //this class/object it self
    var __vch=this.__req.query.voucher;    

    console.log('debug:: addReceiptVoucher');
    console.log('debug:: url ::'+this.__req.url);
    __vch=JSON.parse(__vch);
    console.log('debug:: receipt ::'+JSON.stringify( __vch));
    
    //validate parametes
    __vch = __vch?__vch:{};
    //convert to required type
    __vch.dt= new Date(__vch.dt);
    __vch.amt= parseFloat(__vch.amt);
    __vch.cusID= parseInt(__vch.cusID);
    __vch.cashAccID =parseInt(__vch.cashAccID);
    __vch.bankAccID = parseInt(__vch.bankAccID);
    __vch.chqDt= new Date(__vch.chqDt);
    //specific to date parameters
    if(__vch.dt.getTime()< (new Date(2013,1,1)).getTime()){ //invalid date
      __vch.dt=new Date("");
    }
    if(__vch.chqDt.getTime()< (new Date(2013,1,1)).getTime()){ //invalid date
      __vch.chqDt=new Date("");
    }
    

    //debug -- remove after testing

    console.log('debug:: condition 1 :: '+
    ( !(__vch.cashAccID >0) && !(__vch.bankAccID >0) && !__vch.chqNo ) );
    console.log('debug:: condition 2:: '+
     ( __vch.chqNo && ( __vch.chqDt =="Invalid Date" || !__vch.chqBank) )  );

     console.log('debug:: chqNo :: '+     __vch.chqNo );
     console.log('debug:: chqBank :: '+     __vch.chqBank );
     console.log('debug:: chqDt :: '+     __vch.chqDt );
     console.log('debug:: vch :: '+JSON.stringify(     __vch ));
 
     //debug 

    //must have parameters
    if( (!__vch)    
        || ( !__vch.no)   
        || ( __vch.dt == "Invalid Date")   
        || ( __vch.amt == NaN) || (__vch.amt <=0 )
        || ( __vch.cusID ==NaN) || (__vch.cusID <=0 ) 
      ) {
      this.__status='error';
      this.sendResponse();
      return;
    }    else if (
      ( !(__vch.cashAccID >0) && !(__vch.bankAccID >0) && !__vch.chqNo )
      || ( __vch.chqNo && ( __vch.chqDt =="Invalid Date" || !__vch.chqBank) )   
      ) {
      this.__status='error';
      this.sendResponse();
      return;
    }
    
    if(__vch.cashAccID>0){
      __vch.bankAccID=null;
      __vch.chqNo=null;
      __vch.chqDt=null;
      __vch.chqBank=null;

      console.log('debug:: cash selected. chqdt is '+__vch.chqDt);

    } else if(__vch.bankAccID>0){
      __vch.cashAccID=null;
      __vch.chqNo=null;
      __vch.chqDt=null;
      __vch.chqBank=null;

      console.log('debug:: bank selected. chqdt is '+__vch.chqDt);
      
    } else if(__vch.chqNo){
      __vch.bankAccID=null;
      __vch.cashAccID=null;
    }

    console.log('debug:: vch '+JSON.stringify(     __vch ));

    //begin transaction //todo
    var __frameworkAPI = new frameworkAPI(this.__req, this.__res);    
    //setting up the SQL
    this.StoredProcName= "[dbo].[sp_AddReceiptVoucher]";

    this.addInParameter("vchNo", "varchar", __vch.no);
    this.addInParameter("Dt", "SmallDateTime", __vch.dt);
    this.addInParameter("cusID", "smallInt", __vch.cusID);
    this.addInParameter("Amt", "money", __vch.amt);
    this.addInParameter("cashAccID", "smallint", __vch.cashAccID);
    this.addInParameter("bankAccID", "smallint", __vch.bankAccID);
    this.addInParameter("chqNo", "varchar",__vch.chqNo);
    this.addInParameter("chqDt", "smalldatetime", __vch.chqDt);
    this.addInParameter("chqBank", "varchar", __vch.chqBank);
    this.__sendResponseCallback=sendResponse;
    var __stepNumber=1;    
    this.getData();

    function sendResponse(responseObj)    {
      if (responseObj.status=='OK'){
        if(__stepNumber==1){
          // update next inv number
          __frameworkAPI.setNextReceiptVoucherNo(sendResponse);    
          __stepNumber=2;    
        }else {
          //step 2
          //commit transactions //todo
          this.__res.send(JSON.stringify(responseObj))          
        }

      }else{
        //rollback db transactions //todo
        this.__res.send(JSON.stringify(responseObj))          
      }
    }
  }  

  //
  //  name: addPaymentVoucher
  //
  //  description:
  //    add payment voucher into system  
  //
  //  parameters are in url
  //    voucher={No: string,   dt: Date,    paidByAccID: number,   paidToAccID: number,
  //              amt: number,  desc: string,  isPaidByChq:boolean,
  //              chqNo: string, chqDt:date  chqBank: string }
  //
  //  return:   
  //    OK == successful.    ERROR = failed 
  // 
  addPaymentVoucher(){
    var __this =this;     //this class/object it self
    var __vch=this.__req.query.voucher;    

    console.log('debug:: addPaymentVoucher');
    console.log('debug:: url ::'+this.__req.url);
    __vch=JSON.parse(__vch);
    console.log('debug:: payment ::'+JSON.stringify( __vch));
    
    //validate parametes
    __vch = __vch?__vch:{};
    //convert to required type
    __vch.dt= new Date(__vch.dt);
    __vch.amt= parseFloat(__vch.amt);
    __vch.paidByAccID =parseInt(__vch.paidByAccID);
    __vch.paidToAccID = parseInt(__vch.paidToAccID);
    __vch.chqDt= new Date(__vch.chqDt);
    __vch.isPaidByChq = __vch.isPaidByChq?true:false;
    //specific to date parameters
    if(__vch.dt.getTime()< (new Date(2013,1,1)).getTime()){ //invalid date
      __vch.dt=new Date("");
    }
    if(__vch.chqDt.getTime()< (new Date(2013,1,1)).getTime()){ //invalid date
      __vch.chqDt=new Date("");
    }
    

    //debug -- remove after testing

//    console.log('debug:: condition 1 :: '+
//    ( !(__vch.cashAccID >0) && !(__vch.bankAccID >0) && !__vch.chqNo ) );
//    console.log('debug:: condition 2:: '+
//     ( __vch.chqNo && ( __vch.chqDt =="Invalid Date" || !__vch.chqBank) )  );

     console.log('debug:: chqNo :: '+     __vch.chqNo );
     console.log('debug:: chqDt :: '+     __vch.chqDt );
     console.log('debug:: vch :: '+JSON.stringify(     __vch ));
 
     //debug 

    //must have parameters
    if( (!__vch)    
        || ( !__vch.no)   
        || ( !__vch.des)
        || ( __vch.dt == "Invalid Date")   
        || ( __vch.amt == NaN) || (__vch.amt <=0 )
        || ( __vch.paidByAccID ==NaN) || (__vch.paidByAccID <=0 ) 
        || ( __vch.paidToAccID ==NaN) || (__vch.paidToAccID <=0 ) 
        || (__vch.isPaidByChq && (!__vch.chqNo ||  __vch.chqDt =="Invalid Date" ))
      ) {
      this.__status='error';
      this.sendResponse();
      return;
    }
    
    if(!__vch.isPaidByChq){
      __vch.chqNo=null;
      __vch.chqDt=null;
    }

//    console.log('debug:: vch '+JSON.stringify(     __vch ));

    //begin transaction //todo
    var __frameworkAPI = new frameworkAPI(this.__req, this.__res);    
    //setting up the SQL
    this.StoredProcName= "[dbo].[sp_AddPaymentVoucher]";
    
    this.addInParameter("No", "varchar", __vch.no);
    this.addInParameter("Dt", "SmallDateTime", __vch.dt);
    this.addInParameter("Amt", "money", __vch.amt);
    this.addInParameter("paidByAccID", "smallint", __vch.paidByAccID);
    this.addInParameter("paidToAccID", "smallint", __vch.paidToAccID);
    this.addInParameter("isPaidByChq", "bit", __vch.isPaidByChq);
    this.addInParameter("chqNo", "varchar",__vch.chqNo);
    this.addInParameter("chqDt", "smalldatetime", __vch.chqDt);
    this.addInParameter("dec", "varchar", __vch.des);
    this.__sendResponseCallback=sendResponse;
    var __stepNumber=1;    
    this.getData();

    function sendResponse(responseObj)    {
      if (responseObj.status=='OK'){
        if(__stepNumber==1){
          // update next inv number
          __frameworkAPI.setNextPaymentVoucherNo(sendResponse);    
          __stepNumber=2;    
        }else {
          //step 2
          //commit transactions //todo
          this.__res.send(JSON.stringify(responseObj))          
        }

      }else{
        //rollback db transactions //todo
        this.__res.send(JSON.stringify(responseObj))          
      }
    }
  }  
}
module.exports= accountTransactions;

 //    voucher={no: string,   date: Date,    des:string,    tranType: string,
  //              trans:[{accID:number, desc:string, drAmt:number, crAmt:number}] }
class voucherObject{
    
   constructor(no,date,des,tranType, trans){
     this.no= no;
     this.date=date;
     this.des=des;
     this.tranType=tranType;
     this.trans=trans;
   }
}
     
   //    voucher={no: string,   date: Date,    des:string,    tranType: string,
   //              trans:[{accID:number, desc:string, drAmt:number, crAmt:number}] }
class tranObject{
   constructor(accID, des, drAmt, crAmt){
     this.accID= accID;
     this.des=des;
     this.drAmt= drAmt;
     this.crAmt=crAmt;
   }
}