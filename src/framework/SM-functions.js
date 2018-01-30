
//
//  Name:   SM_functions class
//
//  Description:
//    functions
//
//  functions:
//    executeFunction     execute the function specified in the url 
//

'use strict'

const baseSendData =require( "../framework/baseSendData.js");    //super class
const fs= require('fs');
//const frameworkAPI = require( "../framework/frameworkAPI.js");  

const FUNCTION_TYPE_CODE =29;
const FUNCTION_TYPE_STORED_PROCEDURE =26;
const SM_DATA_TYPE_STRING=23;
const SM_DATA_TYPE_NUMBER=24;
const SM_DATA_TYPE_DATE=28;
const SM_DATA_TYPE_BOOLEAN=1689;
var __count=0;
class SM_functions extends baseSendData{

  constructor (req, res){
    super(req,res);
    this.__class =this;
    __count++;
    this.__cnt=__count;
    console.log(this.__cnt, "SM_functions::started at",Date());
  }
  
  //
  //  name: executeFunction
  //
  //  description:
  //     execute the function specified in the url   
  //
  //  parameters are in url
  //    funNo=number;data={JSON format as expected in calling function}
  //
  //  return:   
  //    OK == successful.    ERROR = failed 
  // 
  executeFunction(data, callbackFunction){
    var __this =this;     //this class/object it self
    try {
      console.log('debug:: SM_functions.executeFunction', 'callbackFunction',callbackFunction);
      //      console.log('debug:: url ::'+this.__req.url);

      var __functionNumber;
      var __data;
      if (data== undefined){
        __functionNumber=this.__req.query.funNo;    //FUNCTION number
        __data=JSON.parse(this.__req.query.data);    //read the data          
      }else{
        __functionNumber=data.funNo;    //FUNCTION number
        __data=data.data;    //read the data                  
      }
      //      console.log('debug:: data ::',__data, this.__req.query.data)
            
      //      console.log('debug:: date ::'+JSON.stringify(__data.trnDate ));
      //      console.log('debug:: date type ::'+ typeof __data.trnDate );
      console.log('debug:: __functionNumber ::', __functionNumber );
      
      if (!__functionNumber>0){
        sendError();
        return;
      } 
      //GET parameters for query
      this.StoredProcName= "[SP_SM_GET_FUNCTION_INPUT_PARAMS]";
      this.clearParameters();
      this.addInParameter("queryID ", "smallint", __functionNumber);
      this.__sendResponseCallback=onComplete_stepOne.bind(this);
      this.getData();
      
      var __parameters;
      var __funName;
      var __funType;

    } catch (error) {
      console.log('error in main');
      console.log (error.stack);
      sendError();
    }

    function onComplete_stepOne(responseObj){
      console.log('onComplete_stepOne');
      var _error=false;
      if (responseObj.status=='OK'){
        // get parameters
        responseObj.rows.forEach((value, index)=>{
          var _val=__data[value.c0];  
          if (_val== undefined || _val==null
              ||(typeof _val=="string" &&  _val=="")   ) {  //null value
            if(value.c3==1){  //not null
              console.log('not null error=', _val);
              _error=true;                  
            } else {
              // so create it
              __data[value.c0]=_val;      
            }
          } else {
            if (value.c4==SM_DATA_TYPE_STRING){ //string
              //cut to the length
              _val = _val.substring(0,value.c2==0?99999999:value.c2);
            }else if (value.c4==25  //reference
              || value.c4==SM_DATA_TYPE_NUMBER  //number
              ){ 
              //check for number type
              _val= new Number(_val);
              if (_val==NaN){ //not a number
                console.log('number error=', _val);
                _error=true;
              }
            } else if(value.c4==SM_DATA_TYPE_DATE){  //date
              //check for date type
              _val= new Date(_val);
              if (_val=="Invalid Date"){ //not a number
                console.log('date error=', _val);
                _error=true;
              }
            } else if(value.c4==SM_DATA_TYPE_BOOLEAN){  //BOOLEAN
              //check for boolean type true or 1 else false
              _val= _val==true || _val==1 ;
            }
          }
          if(!_error){
            __data[value.c0]=_val;
            //            console.log('value name::',value.c0, _val);
          }          
        });
        if (!_error){
          __parameters = responseObj.rows;
          //GET query name and type
          this.StoredProcName= "[SP_SM_GET_FUNCTION]";
          this.clearParameters();
          this.addInParameter("queryID", "smallint", __functionNumber);
          this.__sendResponseCallback=onComplete_stepTwo.bind(this);
          this.getData();
        }
      }else{
        _error=true;
      }
      if (_error){        //error
        console.log('validation error');
        sendError();
      }
    }

    function onComplete_stepTwo(responseObj){
      console.log('onComplete_stepTwo');
      try{
        var _error=false;
        if (responseObj.status=='OK'){
          // get query details
          __funName= responseObj.rows[0].c2;  //F_filename
          __funType = responseObj.rows[0].c1; //F_TYPE
          if (__funType==FUNCTION_TYPE_STORED_PROCEDURE){     //
            console.log('__funType', __funType);
            execProc();
          }else if (__funType==FUNCTION_TYPE_CODE){     //
            var _xc= execCode.bind(this);
            _xc(responseObj);
          }
        }else{
          _error=true;
        }
        if (_error){        //error
          sendError();  
        }
      }catch (error){
        console.log (error.stack);
        sendError();
      }
    }

    function execCode(responseObj){
      var _fileName="./src/framework/"+ responseObj.rows[0].c2; //function file name
      var _jsonString= fs.readFileSync(_fileName,'utf8');
      this.__codeObj = JSON.parse(_jsonString);
      this.__outerCodes= [];
      this.__outerCodeStepNos=[];
      //      var _vars=[];
      this.__stepNo=0;
      var _es=execStep.bind(this);
      _es();
    }

    function execStep(){      
      var _step= this.__codeObj.steps[this.__stepNo]
      console.log("step no", this.__stepNo, _step["description"]);
      if (_step.command_type=="call_a_function_and_get_return_value")        {
        var _paras={};
        _step.command_options.parameters.forEach((para, idx)=>{
          var _val;
          if(typeof para.para_value =="string"){
            _val= eval(formatStringForEval(para.para_value ));  
          }else{
            _val= para.para_value;    // custom value
          }
          _paras[para.para_nm]= _val;
          //          console.log('para nm::',para.para_nm,_val);
        });
        var _dataObj = {funNo:_step.command_options.fun_no, data: _paras} 
        var _API = new SM_functions(this.__req, this.__res);
        _API.executeFunction(_dataObj, getResponse.bind(this));
      } else if(_step.command_type=="javascript"){
        try {
          var _str="";
          _step.script.forEach((line)=>{
            _str+=line;
          });   
          eval(formatStringForEval(_str));  
          var _ns=nextStep.bind(this);
          _ns({status:'OK'});
        } catch (error) {
          console.log('script error', error)              
        }
      } else if(_step.command_type=="IF"){
        try {
          var _IF=eval(formatStringForEval(_step.if_condition));
          //store existing data
          this.__outerCodes.push(Object.assign({},this.__codeObj));
          this.__outerCodeStepNos.push(this.__stepNo);  
          //replace with new 
          this.__stepNo=-1;
          if(_IF){
            this.__codeObj.steps=_step.if_then;
          } else if(_step.if_else) {
            this.__codeObj.steps=_step.if_else;
          } else {
            //no else code so goto next step
            this.__outerCodes.pop();  
            this.__stepNo=this.__outerCodeStepNos.pop();
          }
        //          console.log('codeObj::',this.__codeObj);
          var _ns=nextStep.bind(this);
          _ns({status:'OK'});
        } catch (error) {
          console.log('script error', error)              
        }
      } else if (_step.command_type=="return_single_value"){
        var _ret_val_text= _step.return_value;        
        _ret_val_text=  _ret_val_text.replace(/@/g,"");
        var _ret_val= __data[_ret_val_text]  ;
        var _responseObj={status:"OK", rows:[{c0:_ret_val}]};
        var _ns=nextStep.bind(this);
        _ns(_responseObj);  
      } else if (_step.command_type=="read_file"){
        var _fileName=_step.file_name;
        var _fileName="./src/framework/files/"+_fileName;
        var _fileString= fs.readFileSync(_fileName,'utf8');
        var _assign_to_text= _step.assign_to;        
        _assign_to_text=  _assign_to_text.replace(/@/g,"");
        __data[_assign_to_text] =_fileString;
        var _responseObj={status:"OK"};
        var _ns=nextStep.bind(this);
        _ns(_responseObj);
      } else if (_step.command_type=="FOREACH"){
        try {
          var _str="";
          _step.foreach_function.forEach((line)=>{
            _str+=line;
          });   
          var _array_text= _step.array;        
          _array_text=  formatStringForEval(_array_text);
            //.replace(/@/g,"");
          var _array=eval( _array_text);
          _array.forEach((_item, _index)=>{
            __data.SM_ITEM=_item;
            __data.SM_INDEX=_index;
              eval(formatStringForEval(_str));  
          });
          delete __data.SM_ITEM;
          delete __data.SM_INDEX;
          var _ns=nextStep.bind(this);
          _ns({status:'OK'});
        } catch (error) {
          console.log('script error', error)              
        }
      }      
    }

    function formatStringForEval(str){
      var _str=str.replace(/\/@/g,"~~~~");  
      _str= _str.replace(/@/g,"__data.");  
      _str= _str.replace(/~~~~/g,"@");  
      //            console.log("FORMAT string::", _str);
      return _str
    }

    function getResponse(responseObj){
      if (responseObj.status=='OK'){
        var _step =this.__codeObj.steps[this.__stepNo];
        if(responseObj.rows.length>0){
          __data[_step.command_options.return_value_variable]= responseObj;
          //__data[_step.command_options.return_value_variable]= responseObj.rows[0].c0;
          //console.log('ret var nm::',_step.command_options.return_value_variable, __data[_step.command_options.return_value_variable]);
        }
        var _ns=nextStep.bind(this);
        _ns(responseObj);
      }else{
        sendError();
      }
    }

    function nextStep(responseObj){
      this.__stepNo++;
      if (this.__stepNo>this.__codeObj.steps.length-1){
        console.log('OUTER CODES LENGTH',this.__outerCodes.length);
        if(this.__outerCodes.length>0){
          this.__codeObj = this.__outerCodes.pop();  
          this.__stepNo = this.__outerCodeStepNos.pop();
          console.log('OUTER CODES STEPS',this.__codeObj.steps.length);
          console.log('OUTER CODES STEP no',this.__stepNo);
          var _ns=nextStep.bind(this);
          _ns(responseObj);
        }else {
          var _oepc=onExecProcComplete.bind(this);
          _oepc(responseObj);          
        }
      }else{
        console.log('no of steps:', this.__codeObj.steps.length, 'step no:', this.__stepNo  );
        var _es=execStep.bind(this);
        _es();
      }
    }

    function execProc(){
      //      console.log('execProc');
      //GET parameters for query
      __this.StoredProcName= __funName;
      __this.clearParameters();
      __parameters.forEach((value, index)=>{
      //        console.log(value,  __data[value.c0]);
        __this.addInParameter(value.c0, value.c6, __data[value.c0]);
      });
      __this.__sendResponseCallback= onExecProcComplete;
      __this.getData(); 
    }

    function onExecProcComplete(responseObj){
      //completed. send the result, error or success
      console.log(this.__cnt," SM_functions:: ended at",Date());
      if(!callbackFunction){
        console.log('respond sent');
        this.__res.send(JSON.stringify(responseObj));          
      }else{
        callbackFunction(responseObj);  
      }
      return;
    }

    function sendError(){
      if(!callbackFunction){
        __this.__sendResponseCallback=null;
      }else{
        __this.__sendResponseCallback= callbackFunction;
      }
      __this.__status='error';
      __this.sendResponse();
    }
  }
}
module.exports= SM_functions;

 