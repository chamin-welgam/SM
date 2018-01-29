database = require('./database');

function column (name, type){
  this.name= name;
  this.type= type;
}

class baseSendData{

  constructor(req,res){
    this.__pageIndex= 1;
    this.__pageSize=10;   
    this.__sortBy;
    this.__sortOrder;
    this.__status="";
    this.__columns=[];  //add columns to this, this will return bank
    this.__rows=[];   //add rows to this, this will return bank
    this.__totalRows=0;  //set total rows , this will return bank
    this.__res=res;
    this.__req=req;
    this.__class =this;

    this.__pageIndex= req.query.pageIndex;
    this.__pageSize=req.query.pageSize;   
    this.__sortBy=(req.query.sortBy);
    this.__sortOrder=(req.query.sortOrder);

    this.__sortOrder= ( (typeof this.__sortOrder)=="undefined"?"ASC":this.__sortOrder);    

    this.__db= new database();
    this.__recordCountSQL="";
    this.__getRecordsSQL="";
    this.__getRecordsStoreProc={name:"", inParams:[], outParams:[] };
    this.__sendResponseCallback;    
  }

  set StoredProcName(value){
    this.__getRecordsStoreProc.name=value;
  }

  addInParameter(_name, _type, _value){
    this.__getRecordsStoreProc.inParams.push({name: _name, type: this.__db.getDBType(_type), value:_value});
  }

  addOutParameter(_name, _type){
    this.__getRecordsStoreProc.outParams.push({name: _name, type: this.__db.getDBType(_type)});
  }

  clearParameters()
  {
    this.__getRecordsStoreProc.inParams=[];
    this.__getRecordsStoreProc.outParams=[];
  }

  sendResponse(){
    var _returnObject = {};
    if (this.__status=="OK"){
      _returnObject = {  // okObject
          status:'OK',
          totalRows:this.__totalRows,
          columns: this.__columns,
          rows:this.__rows,
        }    ;
    }else{
      _returnObject ={ //errorObject();
        status:'ERROR'
      };
    }
    if (this.__sendResponseCallback){
      this.__sendResponseCallback(_returnObject);
    } else{
      this.__res.write(JSON.stringify(_returnObject));
      this.__res.status(200).send();
    }
  }    

  getData(){
    //init variables
    this.__status="";
    this.__columns=[];  
    this.__rows=[];   
    this.__totalRows=0;  
    this.__db.connect( this.connected.bind(this),this.errorConnection.bind(this),this.endConnection.bind(this));    
  }

  //callback function for connect megthod
  endConnection() {
    this.sendResponse();
  }

  errorConnection() {
      //todo
  }

  connected(err) {
    if (err) {
      console.log("debug:: error ::"+err);
      this.__status="ERROR";
        this.__db.close();
      return;
    }
    //get Records Count
    if(this.__recordCountSQL){
        this.__db.execSql(this.__recordCountSQL, this.onRecordsCountComplete.bind(this) );
    }else{
        this.beginGetRecords();
    }
  }

  onRecordsCountComplete(err, rowCount, rows){
    if (err || rowCount==0) {
      console.log("debug:: error ::"+err);
      this.__status="ERROR";
        this.__db.close();
      return;
    } 
      rows.forEach ( (item, index)=>{
        this.__totalRows= Number(item[0]["value"]);
      } ) 
      this.beginGetRecords();
  }

  beginGetRecords(){
    if(this.__getRecordsSQL){
      this.__db.execSql(this.__getRecordsSQL,
         this.onGetRecordsSQlComplete.bind(this),
         this.buildColumns.bind(this));   
    }else{
      this.__db.callProcedure(this.__getRecordsStoreProc,
          this.onGetRecordsSQlComplete.bind(this),
          this.buildColumns.bind(this),
          this.onDoneProc.bind(this)
        ); 
    }
  }

  onDoneProc(rowCount, more, returnStatus, rows) {
    if(returnStatus){
      var _record= {};
      _record['c0'] =returnStatus;
      this.__rows.push(_record);
      this.__status="OK";
    }
  }

  onGetRecordsSQlComplete(err, rowCount, rows) {
    if (err) {
      console.log("debug:: error ::"+err);
      this.__status="ERROR";
      this.__db.close();
      return;
    }
    rows.forEach((row, rowIndex)=>{
      var _record= {};
        row.forEach((column,colIndex)=>{
          _record['c'+colIndex] =column.value;
        });
        this.__rows.push(_record);
    } ) 
    this.__status="OK";
    this.__db.close();   
  }

  buildColumns(columnsMetadata) {
    columnsMetadata.forEach((_column) =>{
        this.__columns.push( new column(_column.colName, _column.type.name));  
    });
  }
}
module.exports= baseSendData;