//
//  Name:   salesAPI class
//
//  Description:
//    functions will call the baseView getData(); 
//    ultimatly will return the result in JSON string in response object
//    for the format for return object refer baseView.sendResponse()
//
//  functions:
//    saveInvoice           save invoice
//

const sqlString = require('sqlstring');
const baseSendData =require( "../framework/baseSendData.js");    //super class
const frameworkAPI =require( "../framework/frameworkAPI.js");    //super class

class salesAPI extends baseSendData{

  constructor (req, res){
    super(req,res);
    this.__class =this;
  }

  //
  //  name: saveInvoice
  //
  //  description:
  //    returns account balance 
  //
  //  parameters are in url
  //    invoice = { invManualNo:string, invDate:date, invCustomerID:number, invAmount:number, invIsCash:bool}
  //
  //  return:   
  //    OK == successful.    ERROR = failed 
  // 
  saveInvoice(){
    var __accountID=0;
    var __date = 0;
    var __this =this;     //this class/object it self
    var __invoice=this.__req.query.invoice;    

    console.log('debug:: url ::'+this.__req.url);
    __invoice=JSON.parse(__invoice);
    console.log('debug:: invoice ::'+__invoice);
    
    //validate parametes
    if( (!__invoice)
        || ( !__invoice.invNo)   
        || ( __invoice.invDate == "Invalid Date")   
        || ( !(__invoice.invAmount>0))
        || ( !(__invoice.invCustomerID>0))
        || ( !(__invoice.invManualInvNo))
      ) {
      this.__status='error';
      this.sendResponse();
      return;
    }    
    console.log('debug:: url ::'+__invoice);
    
    var __frameworkAPI = new frameworkAPI(this.__req, this.__res);
    //begin transaction //todo
    
    //setting up the SQL
    this.StoredProcName= "[sp_AddInvoice]";

    this.addInParameter("invNo", "varchar", __invoice.invNo);
    this.addInParameter("invManualInvNo", "varchar", __invoice.invManualInvNo);
    this.addInParameter("invDate", "SmallDateTime", __invoice.invDate);
    this.addInParameter("invCustomerID", "smallInt", __invoice.invCustomerID);
    this.addInParameter("invAmount", "money", __invoice.invAmount);
    this.addInParameter("invIsCash", "bit", __invoice.invIsCash);
    this.addInParameter("invIsCanceled", "bit", 0);
    this.addInParameter("invCanceledReason", "varchar");
    this.__sendResponseCallback=sendResponse;
    var __stepNumber=1;    
    this.getData();

    function sendResponse(responseObj)    {
      console.log(responseObj);
      if (responseObj.status=='OK'){
        if(__stepNumber==1){
          // update next inv number
          __frameworkAPI.setNextInvoiceNo(sendResponse);    
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

module.exports=salesAPI;