const __config = {
    userName: 'SM_769068897',    
    password: '769068897',
    server: 'psms873il',
//     , //'LENOVO-PC', // You can use 'localhost\\instance' to connect to named instance
    options: {
//        port:1433,
        database: 'SM_769068897',
        rowCollectionOnRequestCompletion: true,
        instanceName: 'SQLEXPRESS2017'
    }
}
__connectionClass = require('tedious').Connection;
__requestClass = require('tedious').Request;
var TYPES = require('tedious').TYPES;

class database {

    constructor (){}

    connect (connectedCallback, errorCallback, endCallback ) {
      this.__connection = new __connectionClass(__config);
        
      this.__connection.on('connect', connectedCallback);
      this.__connection.on('errorMessage', errorCallback);
      this.__connection.on('end', endCallback);
  
    }  
  
    execSql(sql, sqlCompletedCallback, columnDataCallback) {
      let _request = new __requestClass(sql, sqlCompletedCallback)
      if(typeof columnDataCallback === 'function'){
          _request.on('columnMetadata', columnDataCallback);
      }
      this.__connection.execSql(_request);
    }
    
    callProcedure(sp, onCompletionCallBack, columnDataCallback, onDoneProcCallBack){
        let _request = new __requestClass(sp.name, onCompletionCallBack);
        sp.inParams.forEach(_param => {
            _request.addParameter(_param.name, _param.type, _param.value) ;
//            console.log('_param.name::',_param.name, ' _param.type::',_param.type, '_param.value::',_param.value);
        });
        sp.outParams.forEach(_param => {
            _request.addOutputParameter(_param.name, _param.type) ;
        });
        if(typeof columnDataCallback === 'function'){
            _request.on('columnMetadata', columnDataCallback);
        }
     //   _request.on('doneProc', onCompletionCallBack);
        this.__connection.callProcedure(_request);
        _request.on('doneProc', onDoneProcCallBack);
    }
    close (){
        this.__connection.close();
    }

    //utility functions
    getDBType(type){
        type= type.toLowerCase();
        var _type= TYPES.VarChar;
        if (type=='varchar'){
            _type= TYPES.VarChar;
        }else if(type=="smalldatetime")    {
            _type =TYPES.SmallDateTime   ;
        }else if(type=="smallint")    {
            _type =TYPES.SmallInt;
        }else if(type=="int")    {
            _type =TYPES.Int;
        }else if(type=="money")    {
            _type =TYPES.Money   ;
        }else if(type=="bit")    {
            _type =TYPES.Bit   ;
        }else if(type=="date")    {
            _type =TYPES.Date   ;
        }else{
            _type=TYPES.VarChar;
        }
        return _type;
    }

}
module.exports=database;