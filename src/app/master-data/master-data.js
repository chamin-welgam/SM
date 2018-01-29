//
//  Name:   masterData  class
//
//  Description:
//    all master data can get from this class.
//    functions will call the baseView getData(); 
//    ultimatly will return the result in JSON string in response object
//    for the format for return object refer baseView.sendResponse()
//
//  functions:
//    getAccountsList         returns all the accounts 
//    getCustomersList         returns list of customers 
//    getSuppliersList 
//    getCashAccountsList  
//    getBankAccountsList
//

baseSendData =require( "../framework/baseSendData.js");    //super class
const __SettingsID_Bank_Parent_AccID = 18;
const __SettingsID_Cash_Parent_AccID = 17;

class masterData  extends baseSendData{

  constructor (req, res){
    super(req,res);
    this.__class =this;
  }

  //
  //  name: getSuppliersList
  //
  //  description:
  //    returns list of suppliers  
  //
  //  parameters:  (are in url)
  //    none
  //
  //  return:   
  //    list of suppliers -- only id, code and Name
  //  
  getSuppliersList (){
    var __this =this;     //this class/object it self
    
    console.log('debug:: get supplier page hit');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.__recordCountSQL= getRecordsCountSQL();
    this.__getRecordsSQL=getRecordsSQL();
    this.getData();

    function getRecordsCountSQL(){
        //get Records Count
      var _sql =
      "   select  count(*)"+
      "   FROM "+
      "     Suppliers ";
      return _sql;
    }

    function getRecordsSQL() {
      var _sql =
      "   SELECT  "+
      "     [id] , [Code] , [Name] "+
      "   FROM "+
      "     Suppliers "+
      "   ORDER BY [Code]"
      return _sql;
    } 
  }

  //
  //  name: getCustomersList
  //
  //  description:
  //    returns list of customers  
  //
  //  parameters:  (are in url)
  //    none
  //
  //  return:   
  //    list of customers only id, code and Name
  //  
  getCustomersList (){
    var __this =this;     //this class/object it self
    
    console.log('debug:: get customers page hit');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.__recordCountSQL= getRecordsCountSQL();
    this.__getRecordsSQL=getRecordsSQL();
    this.getData();

    function getRecordsCountSQL(){
        //get Records Count
      var _sql =
      "   select  count(*)"+
      "   FROM "+
      "     Customers ";
      return _sql;
    }

    function getRecordsSQL() {
      var _sql =
      "   SELECT  "+
      "     [id] CustomerID, [Code] CustomerCode, [Name] CustomerName"+
      "   FROM "+
      "     Customers "+
      "   ORDER BY [Code]"
      return _sql;
    } 
  }

  //
  //  name: getAccounts
  //
  //  description:
  //    returns list of accounts  
  //
  //  parameters:  (are in url)
  //    none
  //
  //  return:   
  //    list of accounts with id, coed , name  
  //  
  getAccountsList (){
    var __this =this;     //this class/object it self
    
    console.log('debug:: /api/getAccounts page hit');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.__recordCountSQL= getRecordsCountSQL();
    this.__getRecordsSQL=getRecordsSQL();
    this.getData();

    function getRecordsCountSQL(){
        //get Records Count
      var _sql =
      "   select  count(*)"+
      "   FROM "+
      "     AccountsMaster ";
      return _sql;
    }

    function getRecordsSQL() {
      var _sql =
      "   SELECT  "+
      "     [recordid], [AccountCode], [AccountName]"+
      "   FROM "+
      "     AccountsMaster "+
      "   ORDER BY [AccountCode]"
      return _sql;
    } 
  }

  //
  //  name: getCashAccountsList
  //
  //  description:
  //    returns list of Cash accounts  
  //
  //  parameters:  (are in url)
  //    none
  //
  //  return:   
  //    list of accounts with id, coed , name  
  //  
  getCashAccountsList (){
    var __this =this;     //this class/object it self
    
    console.log('debug:: /api/getAccounts page hit');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.__recordCountSQL= getRecordsCountSQL();
    this.__getRecordsSQL=getRecordsSQL();
    this.getData();

    function getRecordsCountSQL(){
        //get Records Count
      var _sql =
      "   select  count(*)"+
      "   FROM "+
      "     AccountsMaster "+
      "   where  ParentAccount= (SELECT SettingsValue FROM [Settings] WHERE " +
      "   [SettingsID]= "+ __SettingsID_Cash_Parent_AccID +" )";
      return _sql;
    }

    function getRecordsSQL() {
      var _sql =
      "   SELECT  "+
      "     [recordid], [AccountCode], [AccountName]"+
      "   FROM "+
      "     AccountsMaster "+
      "   where  ParentAccount= (SELECT SettingsValue FROM [Settings] WHERE " +
      "   [SettingsID]= "+ __SettingsID_Cash_Parent_AccID +") "+
      "   ORDER BY [AccountCode]";
      return _sql;
    } 
  }
  
  //
  //  name: getBankAccountsList
  //
  //  description:
  //    returns list of bank accounts  
  //
  //  parameters:  (are in url)
  //    none
  //
  //  return:   
  //    list of accounts with id, code , name  
  //  
  getBankAccountsList (){
    var __this =this;     //this class/object it self
    
    console.log('debug:: getBankAccountsList');
    console.log('debug:: url ::'+this.__req.url);
    
    //setting up the SQL
    this.__recordCountSQL= getRecordsCountSQL();
    this.__getRecordsSQL=getRecordsSQL();
    this.getData();

    function getRecordsCountSQL(){
        //get Records Count
      var _sql =
      "   select  count(*)"+
      "   FROM "+
      "     AccountsMaster "+
      "   where  ParentAccount= (SELECT SettingsValue FROM [Settings] WHERE " +
      "   [SettingsID]= "+ __SettingsID_Bank_Parent_AccID +")";
      return _sql;
    }

    function getRecordsSQL() {
      var _sql =
      "   SELECT  "+
      "     [recordid], [AccountCode], [AccountName]"+
      "   FROM "+
      "     AccountsMaster "+
      "   where  ParentAccount= (SELECT SettingsValue FROM [Settings] WHERE " +
      "   [SettingsID]= "+ __SettingsID_Bank_Parent_AccID +") "+
      "   ORDER BY [AccountCode]";
      return _sql;
    } 
  }


} 

module.exports=masterData;