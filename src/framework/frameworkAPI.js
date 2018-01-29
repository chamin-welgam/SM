//
//  Name:   frameworkAPI class
//
//  Description:
//    provide functions that related to framwork 
//    will call the baseView getData(); 
//    ultimatly will return the result in JSON string in response object
//    for the format for return object refer baseView.sendResponse()
//
//  functions:
//    getNextTransactionNo
//    setNextTransactionNo
//    getNextInvoiceNo      returns the next invoice number 
//    setNextInvoiceNo      sets the next invoice number 
//    getNextExpenseVoucherNo  --returns the next expense voucer number 
//    setNextExpenseVoucherNo  --sets the next expense voucer number 
//    getNextPurchaseVoucherNo  --returns the next purchase voucer number 
//    setNextPurchaseVoucherNo  --sets the next purchase voucer number 
//    getNextJournalVoucherNo
//    setNextJournalVoucherNo
//    getNextReceiptVoucherNo
//    setNextReceiptVoucherNo
//    getNextPaymentVoucherNo
//    setNextPaymentVoucherNo
//

baseSendData =require( "../framework/baseSendData.js");    //super class

class frameworkAPI extends baseSendData{

  constructor (req, res){
    super(req,res);
    this.__class =this;
  }

  //
  //  name: getNextTransactionNo
  //
  //  description:
  //    returns next transaction number 
  //
  //  parameters are in url
  //    :transactionType     -- name of transaction 
  //      CASHEXPENSES || INVOICE || JOURNAL_ENTRY || PAYMENT
  //      || PURCHASE || RECEIPT || SALESRTN
  //    :callBackFucn      -- if provided result will be send to fucntion, 
  //                       -- if ommited result will be send to httpResponse
  //
  //  return:   
  //    Next transaction No 
  //
  //  uses:
  //    sp_GetNextTransactionNumber stored procedure in database
  //
  getNextTransactionNo (transactionType, callBackFucn){
    var __this =this;     //this class/object it self
    
    console.log('debug:: getNextTransactionInvoiceNo');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.StoredProcName= "[sp_GetNextTransactionNumber]";
    this.clearParameters();
    this.addInParameter("trns", "varchar", transactionType);
    this.addInParameter("UsrID", "smallint", 1);
    if(callBackFucn){
      this.__sendResponseCallback=callBackFucn;
    }
    this.getData();
  }

  //
  //  name: setNextTransactionInvoiceNo
  //
  //  description:
  //    sets the next transaction number  
  //
  //  parameters are in url
  //    :transactionType     -- name of transaction 
  //      CASHEXPENSES || INVOICE || JOURNAL_ENTRY || PAYMENT
  //      || PURCHASE || RECEIPT || SALESRTN
  //    :callBackFucn      -- if provided result will be send to fucntion, 
  //                       -- if ommited result will be send to httpResponse
  //  return:   
  //    ok -- success
  //    error  -- failed
  //  
  //  uses:
  //    sp_SetNextTransactionNumber stored procedure in database
  //    
  setNextTransactionNo (transactionType, callBackFucn){
    var __this =this;     //this class/object it self
    
    console.log('debug:: getNextTransactionInvoiceNo');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.StoredProcName= "[sp_SetNextTransactionNumber]";
    this.clearParameters();
    this.addInParameter("trns", "varchar", transactionType);
    this.addInParameter("UsrID", "smallint", 1);
    if(callBackFucn){
      this.__sendResponseCallback=callBackFucn;
    }
    this.getData();
  }

  //
  //  name: getNextInvoiceNo
  //
  //  description:
  //    returns next invoice no 
  //
  //  parameters are in url
  //    :callBackFucn      -- if provided result will be send to fucntion, 
  //                       -- if ommited result will be send to httpResponse
  //
  //  return:   
  //    Next Invoice No 
  //  
  //  uses:/dependancy
  //    this.getNextTransactionNo
  //
  getNextInvoiceNo (callBackFucn){
    var __this =this;     //this class/object it self
    
    console.log('debug:: getNextInvoiceNo');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.getNextTransactionNo('INVOICE', callBackFucn);
  }

  //
  //  name: setNextInvoiceNo
  //
  //  description:
  //    sets next invoice no 
  //
  //  parameters are in url
  //    :callBackFucn      -- if provided result will be send to fucntion, 
  //                       -- if ommited result will be send to httpResponse
  //
  //  return:   
  //    OK -- succeed
  //    ERROR -- failed
  //    
  //  uses:/dependancy
  //    this.setNextTransactionNo
  //
  setNextInvoiceNo (callBackFucn){
    var __this =this;     //this class/object it self
    
    console.log('debug:: setNextInvoiceNo');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.setNextTransactionNo('INVOICE', callBackFucn);
  }

  //
  //  name: getNextExpenseVoucherNo
  //
  //  description:
  //    returns next expense voucher no 
  //
  //  parameters are in url
  //    :callBackFucn      -- if provided result will be send to fucntion, 
  //                       -- if ommited result will be send to httpResponse
  //
  //  return:   
  //    Next expense voucher no
  //  
  //  uses:/dependancy
  //    this.getNextTransactionNo
  //
  getNextExpenseVoucherNo (callBackFucn){
    var __this =this;     //this class/object it self
    
    console.log('debug:: getNextExpeseVaoucherNo');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.getNextTransactionNo('CASHEXPENSES', callBackFucn);
  }

  //
  //  name: setNextExpenseVoucherNo
  //
  //  description:
  //    sets next expense voucher no 
  //
  //  parameters are in url
  //    :callBackFucn      -- if provided result will be send to fucntion, 
  //                       -- if ommited result will be send to httpResponse
  //
  //  return:   
  //    OK -- succeed
  //    ERROR -- failed
  //    
  //  uses:/dependancy
  //    this.setNextTransactionNo
  //
  setNextExpenseVoucherNo (callBackFucn){
    var __this =this;     //this class/object it self
    
    console.log('debug:: setNextExpeseVaoucherNo');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.setNextTransactionNo('CASHEXPENSES', callBackFucn);
  }

  //
  //  name: getNextPuchaseVoucherNo
  //
  //  description:
  //    returns next purchase voucher no 
  //
  //  parameters are in url
  //    :callBackFucn      -- if provided result will be send to fucntion, 
  //                       -- if ommited result will be send to httpResponse
  //
  //  return:   
  //    Next purchase voucher No 
  //  
  //  uses:/dependancy
  //    this.getNextTransactionNo
  //
  getNextPurchaseVoucherNo (callBackFucn){
    var __this =this;     //this class/object it self
    
    console.log('debug:: getNextPuchaseVoucherNo');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.getNextTransactionNo('PURCHASE', callBackFucn);
  }

  //
  //  name: setNextPuchaseVoucherNo
  //
  //  description:
  //    sets next PURCHASE voucher no 
  //
  //  parameters are in url
  //    :callBackFucn      -- if provided result will be send to fucntion, 
  //                       -- if ommited result will be send to httpResponse
  //
  //  return:   
  //    OK -- succeed
  //    ERROR -- failed
  //    
  //  uses:/dependancy
  //    this.setNextTransactionNo
  //
  setNextPurchaseVoucherNo (callBackFucn){
    var __this =this;     //this class/object it self
    
    console.log('debug:: setNextPuchaseVoucherNo');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.setNextTransactionNo('PURCHASE', callBackFucn);
  }

  //
  //  name: getNextJournalVoucherNo
  //
  //  description:
  //    returns next Journal voucher no 
  //
  //  parameters are in url
  //    :callBackFucn      -- if provided result will be send to fucntion, 
  //                       -- if ommited result will be send to httpResponse
  //
  //  return:   
  //    Next Journal voucher No 
  //  
  //  uses:/dependancy
  //    this.getNextTransactionNo
  //
  getNextJournalVoucherNo (callBackFucn){
    var __this =this;     //this class/object it self
    
    console.log('debug:: getNextJournalVoucherNo');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.getNextTransactionNo('JOURNAL_ENTRY', callBackFucn);
  }

  //
  //  name: setNextJournalVoucherNo
  //
  //  description:
  //    sets next Journal voucher no 
  //
  //  parameters are in url
  //    :callBackFucn      -- if provided result will be send to fucntion, 
  //                       -- if ommited result will be send to httpResponse
  //
  //  return:   
  //    OK -- succeed
  //    ERROR -- failed
  //    
  //  uses:/dependancy
  //    this.setNextTransactionNo
  //
  setNextJournalVoucherNo (callBackFucn){
    var __this =this;     //this class/object it self
    
    console.log('debug:: setNextJournalVoucherNo');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.setNextTransactionNo('JOURNAL_ENTRY', callBackFucn);
  }

  //
  //  name: getNextReceiptVoucherNo
  //
  //  description:
  //    returns next Journal voucher no 
  //
  //  parameters are in url
  //    :callBackFucn      -- if provided result will be send to fucntion, 
  //                       -- if ommited result will be send to httpResponse
  //
  //  return:   
  //    Next Journal voucher No 
  //  
  //  uses:/dependancy
  //    this.getNextTransactionNo
  //
  getNextReceiptVoucherNo (callBackFucn){
    var __this =this;     //this class/object it self
    
    console.log('debug:: getNextReceiptVoucherNo');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.getNextTransactionNo('RECEIPT', callBackFucn);
  }

  //
  //  name: setNextReceiptVoucherNo
  //
  //  description:
  //    sets next receipt voucher no 
  //
  //  parameters are in url
  //    :callBackFucn      -- if provided result will be send to fucntion, 
  //                       -- if ommited result will be send to httpResponse
  //
  //  return:   
  //    OK -- succeed
  //    ERROR -- failed
  //    
  //  uses:/dependancy
  //    this.setNextTransactionNo
  //
  setNextReceiptVoucherNo (callBackFucn){
    var __this =this;     //this class/object it self
    
    console.log('debug:: setNextReceiptVoucherNo');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.setNextTransactionNo('RECEIPT', callBackFucn);
  }

  //
  //  name: getNextPaymentVoucherNo
  //
  //  description:
  //    returns next Payment voucher no 
  //
  //  parameters are in url
  //    :callBackFucn      -- if provided result will be send to fucntion, 
  //                       -- if ommited result will be send to httpResponse
  //
  //  return:   
  //    Next Journal voucher No 
  //  
  //  uses:/dependancy
  //    this.getNextTransactionNo
  //
  getNextPaymentVoucherNo (callBackFucn){
    var __this =this;     //this class/object it self
    
    console.log('debug:: getNextPaymentVoucherNo');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.getNextTransactionNo('PAYMENT', callBackFucn);
  }

  //
  //  name: setNextPaymentVoucherNo
  //
  //  description:
  //    sets next Payment voucher no 
  //
  //  parameters are in url
  //    :callBackFucn      -- if provided result will be send to fucntion, 
  //                       -- if ommited result will be send to httpResponse
  //
  //  return:   
  //    OK -- succeed
  //    ERROR -- failed
  //    
  //  uses:/dependancy
  //    this.setNextTransactionNo
  //
  setNextPaymentVoucherNo (callBackFucn){
    var __this =this;     //this class/object it self
    
    console.log('debug:: setNextPaymentVoucherNo');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.setNextTransactionNo('PAYMENT', callBackFucn);
  }

}

module.exports=frameworkAPI;