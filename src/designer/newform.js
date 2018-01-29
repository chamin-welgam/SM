//
//  Name:   formClass
//
//  Description:
//    functions to create forms
//
//  functions:
//    addPaymentVoucher
//

'use strict'

const baseSendData =require( "../framework/baseSendData.js");    //super class
const _fs= require('fs');

class SM_form extends baseSendData{

  constructor (req, res){
    super(req,res);
    this.__class =this;
  }

  //
  //  name: newForm
  //
  //  description:
  //    create backend table and SP and frontend  file 
  //    base on the input form name
  //

  newForm(){
    try{
      var _formName=this.__req.query.data.formName;
      var _fileName="./src/designer/forms/"+_fileName+".json";
      var _jsonString= _fs.readFileSync(_fileName,'utf8');
      this.__formObj = JSON.parse(_jsonString);

      //create table
      this.createSQLTable();
      //create SP and update function and parameter table
      this.createSP_SQL();
      //create jsonFile for form design
      this.createFormDesignJson();
      this.onComplete();
    } catch (error) {
      console.log('error in main');
      console.log (error.stack);
      this.sendError();
    }
  }

  onComplete(){
    this.__status='OK';
    this.sendResponse();
  }

  sendError(){
    this.__status='error';
    this.sendResponse();
  }

  //
  //  name: createFormDesignJson
  //
  //  description:
  //    create design json file base on json file loaded in  __formObj
  //     that use by SM_form.create to create HTML file
  //
  //  parameters :  none
  //
  //  return:   none
  // 
  createFormDesignJson(){
    console.log("SM_form.createFormDesignJson");    
    var _fileName="./src/designer/forms/template_FormDesignInJson.json";
    var _jsonStr= _fs.readFileSync(_fileName,'utf8');
    var _rows="";

    this.__formObj.rows.forEach(_field => {
      let _fieldLength=_field.length;
      let _controlType="";
      let _otherInfo="";
      if (_field.type=="reference") {
        _controlType="select"
        _otherInfo="\r\n\"functionNo\":"+_field.functionNo +","+
                  "\r\n\"functionParameters\": "+JSON.stringify(_field.functionParameters)+",";   
      } else if (_field.type=="sequence") {
        _controlType="sequence";
        _otherInfo="\r\n\"functionNo\":"+_field.functionNo +","+
                  "\r\n\"functionParameters\":"+JSON.stringify(_field.functionParameters)+",";
      } else if (_field.type=="enum") {
        _controlType="select";
        _otherInfo="\r\n\"functionNo\":"+_field.functionNo +","+
                  "\r\n\"functionParameters\":"+JSON.stringify(_field.functionParameters)+",";
      } else if (_field.type=="bit") {
        _controlType="radioButton";
        _otherInfo="\r\n\"options\":"+ JSON.stringify(_field.options)+","+
                  "\r\n\"default\":"+_field.default+",";
      } else if (_field.type=="varchar") {
        _controlType="text";
      } else if (_field.type=="money") {
        _controlType="number";
      } else if (_field.type=="date" || _field.type=="smalldatetime"
                ||_field.type=="time") {
        _controlType="calendar";
      } else if (_field.type=="int") {
        _controlType="number";
      }        
      _rows+=",{" +
        "\r\n\"controlType\":\""+_controlType+"\","+
        "\r\n\"label\": \""+_field.label+ "\","+
        "\r\n\"fieldName\":\""+_field.fieldName+"\","+
        "\r\n\"allowNull\":\""+_field.allowNull+"\","+
        "\r\n\"length\":"+ _fieldLength+","+
        "\r\n\"visible\":\""+ _field.visible+"\""+(_otherInfo!=""?",":"")+
         _otherInfo.slice(1,-1) +"\r\n}";
    });
    _rows = _rows.slice(1);
    _jsonStr=_jsonStr.replace(/%{title}%/g,this.__formObj.title);
    _jsonStr=_jsonStr.replace(/%{formName}%/g,this.__formObj.formName);
    _jsonStr=_jsonStr.replace(/%{saveFunctionNo}%/g,this.__formObj.saveFunctionNo);
    _jsonStr=_jsonStr.replace(/%{rows}%/g,_rows);
    //write file
    _fs.writeFileSync("./src/designer/forms/form-"+this.__formObj.formName+".json",_jsonStr,"utf8");    
  }

  //
  //  name: createSP_SQL
  //
  //  description:
  //    create SQL script that creates a INSERT stored procedure
  //    base on json file loaded in  __formObj. and add records to functoion and parameters table
  //
  //  parameters :  none
  //
  //  return:   none
  // 
  createSP_SQL(){
    console.log("createSP_SQL");    
    var _fileName="./src/designer/forms/createSP.sql";
    var _sqlString= _fs.readFileSync(_fileName,'utf8');
    var _tblName = "T_"+this.__formObj.formDataStoreName;
    var _parametersList="";
    var _fieldsList="";
    var _fieldParametersList="";
    var _insParamsCmds="";

    this.__formObj.rows.forEach(_field => {
      _parametersList+=",@"+_field.fieldName+" ";
      _fieldsList+=",[F_"+_field.fieldName+"] ";
      _fieldParametersList+=",@"+_field.fieldName+" "
      let _fieldtype= _field.type;
      let _fieldLength="("+_field.length+") ";
      let _sqlDataType=17;
      let _smDataType=23;
      if (_fieldtype=="reference") {
        _fieldtype="int";
        _fieldLength="";
        _sqlDataType=4;
        _smDataType=24;
      } else if (_field.type=="sequence") {
        _fieldtype="varchar";
        _sqlDataType=17;
        _smDataType=23;
      } else if (_field.type=="enum") {
        _fieldtype="int";
        _fieldLength="";
        _sqlDataType=5;
        _smDataType=24;
      } else if (_field.type=="bit") {
        _fieldLength="";
        _sqlDataType=1;
        _smDataType=1689;
      } else if (_field.type=="varchar") {
        _sqlDataType=17;
        _smDataType=23;
      } else if (_field.type=="money") {
        _fieldLength="";
        _sqlDataType=9;
        _smDataType=24;
      } else if (_field.type=="date" || _field.type=="smalldatetime"
                ||_field.type=="time") {
        _sqlDataType=13;
        _fieldLength="";
        _smDataType=28;
      } else if (_field.type=="int") {
        _fieldLength="";
        _sqlDataType=5;
        _smDataType=24;
      }        
      _parametersList+=" ["+_fieldtype+"] "+ _fieldLength;
      _insParamsCmds+="\r\n"+
        "EXEC	@return_value = [dbo].[SP_SM_INS_FUNCTION_INPUT_PARAMS] "+
        " @NM = N'"+_field.fieldName +"',	@SQL_DATATYPE ="+_sqlDataType +
        ",		@LENGTH = "+( _fieldLength==""?0:Number.parseInt(_fieldLength.slice(1,-1)) )+      
        ",	@IS_NOT_NULL = "+ (_field.allowNull==true?0:1) +
        " ,@SM_DATATYPE = "+ _smDataType +", @ENUM_GRPID = NULL,	@FUN_ID = @FUNID; ";
  
    });
    _sqlString=_sqlString.replace(/%{tableName}%/g,_tblName);
    _sqlString=_sqlString.replace(/%{parametersList}%/g,_parametersList.slice(1));
    _sqlString=_sqlString.replace(/%{fieldsList}%/g,_fieldsList.slice(1));
    _sqlString=_sqlString.replace(/%{fieldParametersList}%/g,_fieldParametersList.slice(1));
    _sqlString=_sqlString.replace(/%{insParamsCmds}%/g,_insParamsCmds);    
    //write file
    _fs.writeFileSync("./src/designer/forms/create_SP-"+_tblName+".sql",_sqlString,"utf8");
    
  }

  //
  //  name: createSQLTable
  //
  //  description:
  //    create SQL table for the form and its foreign keys and indexes
  // 
  createSQLTable(){
    console.log("createSQLTable");
    var SM_fun =require('../framework/SM-functions.js');
    
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
              this.__res.send(JSON.stringify(responseObj));          
            }else{
              callbackFunction(responseObj);  
            }
            return;
          }

    var _fileName="./src/designer/forms/newForm.sql";
    var _sqlString= _fs.readFileSync(_fileName,'utf8');
    var _tblName = "T_"+this.__formObj.formDataStoreName;
    var _fieldsSQL = "";
    var _foreignSQL ="";
    var _UniqueIndxes="";
    this.__formObj.rows.forEach(_field => {
      _fieldsSQL+="[F_"+_field.fieldName+ '] ';
      let _fieldtype= _field.type;
      let _fieldLength="("+_field.length+") ";
      if (_fieldtype=="reference") {
        let _referenceTbl = _field.referenceTable;
        _foreignSQL+=  
          "\r\nALTER TABLE [dbo].["+_tblName +"]  WITH CHECK ADD  CONSTRAINT "+
          "[FK_"+_tblName+"_"+ _referenceTbl +"-F_" +_field.fieldName +"] FOREIGN KEY([F_" +_field.fieldName +"]) "+
          "REFERENCES [dbo].["+_referenceTbl +"] ([F_ID])"+
          "\r\n\GO";
        _UniqueIndxes+="\r\n"+
          "CREATE NONCLUSTERED INDEX [IX_"+_tblName+"-"+_field.fieldName+"] ON [dbo].["+_tblName+"]"+
          "( [F_"+_field.fieldName+"] ASC )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF,"+
          " SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, "+
          " ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]"+
          "\r\n\GO";
        _fieldtype="int";
        _fieldLength="";
      } else if (_field.type=="sequence") {
        _fieldtype="varchar";
      } else if (_field.type=="enum") {
        _foreignSQL+=  
          "\r\nALTER TABLE [dbo].["+_tblName +"]  WITH CHECK ADD  CONSTRAINT "+
          "[FK-"+_tblName+"-T_SM_ENUMS"+"-F_" +_field.fieldName +"] FOREIGN KEY([F_" +_field.fieldName +"]) "+
          "REFERENCES [dbo].[T_SM_ENUMS]([F_ID])";
        _UniqueIndxes+="\r\n"+
          "CREATE NONCLUSTERED INDEX [IX-"+_tblName+"-"+_field.fieldName+"] ON [dbo].["+_tblName+"]"+
          "( [F_"+_field.fieldName+"] ASC )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF,"+
          " SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, "+
          " ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]"+
          "\r\n\GO";
        _fieldtype="int";
        _fieldLength="";
      } else if (_field.type=="bit") {
        _fieldLength="";
      } else if (_field.type=="varchar") {
      } else if (_field.type=="money") {
        _fieldLength="";
      } else if (_field.type=="date" || _field.type=="smalldatetime"
                ||_field.type=="time") {
        _fieldLength="";
      } else if (_field.type=="int") {
        _fieldLength="";
      } else if (_field.type=="subForm") {
        _fieldLength="";
      }        

      _fieldsSQL+=" ["+_fieldtype+"] "+_fieldLength + (_field.allowNull?"NULL":"NOT NULL") +",";
      if(!_field.allowDuplicate){
        _UniqueIndxes+="\r\n"+
          "CREATE UNIQUE NONCLUSTERED INDEX [IX-UQ-"+_tblName+"-"+_field.fieldName+"] ON [dbo].["+_tblName+"]"+
          "( [F_"+_field.fieldName+"] ASC )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF,"+
          " SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, "+
          " ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]"+
          "\r\n\GO";
      }
    });
    _sqlString=_sqlString.replace(/%{tableName}%/g,_tblName);
    _sqlString=_sqlString.replace(/%{fields}%/g,_fieldsSQL);
    _sqlString=_sqlString.replace(/%{indexes}%/g,_UniqueIndxes);
    _sqlString=_sqlString.replace(/%{foreignkeys}%/g,_foreignSQL);
    //write file
    _fs.writeFileSync("./src/designer/forms/create_TABLE"+_tblName+".sql",_sqlString,"utf8");
  }

  //
  //  name: create
  //
  //  description:
  //    create html and ts file base on json file
  //
  //  parameters :
  //
  //  return:   
  // 
  create(){
    var __this =this;     //this class/object it self
    const _fs= require('fs');
    try {
      console.log('debug:: formClass.create function');
      console.log('debug:: url ::'+this.__req.url);

      
      //html structure
      var _formHTML_FileName = "./src/designer/templates/SM-form-single-column.html";
      var _formHTML= _fs.readFileSync(_formHTML_FileName,'utf8');
      //ts file
      var _form_ts_FileName = "./src/designer//templates/SM-form-component.ts";
      var _form_ts= _fs.readFileSync(_form_ts_FileName,'utf8');

      var _fileName=this.__req.query.fileName;
      //form json format
      var _fileName="./src/designer/forms/"+_fileName+".json";
      var _jsonString= _fs.readFileSync(_fileName,'utf8');
      var _formObj = JSON.parse(_jsonString);

      var _title = _formObj.title;
      var _formName = _formObj.formName;

      var _rowsHTML="";
      var _formVariables="";
      var _formInitLists="";
      var _formFunctions="";
      var _formNewFormDataFunctionCode="";
      var _formSaveFunctoinCode="";

      for (let _rowNo = 0; _rowNo < _formObj.rows.length; _rowNo++) {
        console.log("row no", _rowNo);
        var _row= _formObj.rows[_rowNo]
        if (_row.controlType=="text") { ins_textControl(_row);}
        else if (_row.controlType=="select"){ins_selectControl(_row);}
        else if (_row.controlType=="number"){ins_numberControl(_row);}
        else if (_row.controlType=="sequence"){ins_sequenceControl(_row);}
        else if (_row.controlType=="radioButton"){ins_radioButtonControl(_row);}
        else if (_row.controlType=="calendar"){ins_calendarControl(_row);}
      }
      // create html file
      _formHTML= _formHTML.replace(/%{_title}%/g,_title);
      _formHTML= _formHTML.replace(/%{_body}%/g,_rowsHTML);
      _fs.writeFileSync("./src/designer/forms/"+_formName+".component.html",_formHTML,"utf8");
      // create ts file
      _form_ts = _form_ts.replace(/%{formName}%/g,_formName);
      _form_ts = _form_ts.replace(/%{formVariables}%/g,_formVariables);
      _form_ts = _form_ts.replace(/%{formInitLists}%/g,_formInitLists);
      _form_ts = _form_ts.replace(/%{formFunctions}%/g,_formFunctions);
      _form_ts = _form_ts.replace(/%{formNewFormDataFunctionCode}%/g,_formNewFormDataFunctionCode);
      _form_ts = _form_ts.replace(/%{formSaveFunctoinCode}%/g,_formSaveFunctoinCode);
      _form_ts = _form_ts.replace(/%{saveFunNo}%/g,_formObj.saveFunctionNo)
      _fs.writeFileSync("./src/designer/forms/"+_formName+".component.ts",_form_ts,"utf8");
      var onCompleteFunc =onComplete.bind(this);
      onCompleteFunc({status:"OK"});
    } catch (error) {
      console.log('error in main');
      console.log (error.stack);
      sendError();
    }

    function formatCorrection(str){
      while (1==1){
        var _startPos=str.search("{field:");
        if(_startPos>=0){
          let _endPos = str.indexOf("}",_startPos);
          let _originalVal= str.substr(_startPos,_endPos+1);
          let _formatVal=_originalVal.toString();
          _formatVal= _formatVal.replace("\{field:","");
         //get field name
          let _var = _formatVal.slice(0,-1);
          _var="__"+_var;
          str= str.replace(_originalVal,_var);
        }else{break;}
      }
      return str;
    }

    function ins_textControl(row){
      var _textCtrlHTML_FileName = "./src/designer/templates/SM-form-single-column-text-control.html";
      var _textCtrlHTML= _fs.readFileSync(_textCtrlHTML_FileName ,'utf8');
      var _label = row.label;
      var _fieldName = row.fieldName;
      _textCtrlHTML=_textCtrlHTML.replace(/%{label}%/g, _label);
      _textCtrlHTML=_textCtrlHTML.replace(/%{fieldName}%/g, _fieldName);
      var _visible="";
      if(row.visible){
        _visible = "*ngIf=\""+formatCorrection(row.visible)+"\"" ;
      }
      _textCtrlHTML=_textCtrlHTML.replace(/%{visible}%/g,_visible);
      _rowsHTML+="\r\n"+ _textCtrlHTML;
      _formVariables +="\r\n\t__"+ _fieldName +"=\"\";";
      _formNewFormDataFunctionCode += "\r\n\t\tthis.__"+ _fieldName+"=\"\";";
      _formSaveFunctoinCode += "\r\n\t\t\t\t"+ _fieldName+": this.__"+_fieldName+",";
    }

    function ins_selectControl(row){
      var _selectCtrlHTML_FileName = "./src/designer/templates/SM-form-single-column-select-control.html";
      var _selectCtrlHTML= _fs.readFileSync(_selectCtrlHTML_FileName ,'utf8');
      var _label = row.label;
      var _fieldName = row.fieldName;
      _selectCtrlHTML=_selectCtrlHTML.replace(/%{label}%/g, _label);
      _selectCtrlHTML=_selectCtrlHTML.replace(/%{fieldName}%/g, _fieldName);
      var _visible="";
      if(row.visible){
        _visible = "*ngIf=\""+formatCorrection(row.visible)+"\"" ;
      }
      _selectCtrlHTML=_selectCtrlHTML.replace(/%{visible}%/g,_visible);
      _rowsHTML+="\r\n"+ _selectCtrlHTML;
      _formVariables +="\r\n\t__"+ _fieldName +"=\"\";";
      _formVariables +="\r\n\t__listOf"+ _fieldName +"=[];";
      _formNewFormDataFunctionCode += "\r\n\t\tthis.__"+ _fieldName+"=\"\";";
      _formSaveFunctoinCode += "\r\n\t\t\t\t"+ _fieldName+": this.__"+_fieldName+",";
      _formInitLists+="\r\n\t\t"+"this.getListOf"+_fieldName+"();";
      _formFunctions+="\r\n"+
        "\tgetListOf"+_fieldName+"(){\r\n"+
        "\t  var _url= (<any>AppConfig).httpCallPath+\"/api/function\";\r\n"+
        "\t  var _data="+
        JSON.stringify(row.functionParameters)
        +";\r\n"+
        "\t  var _params = new HttpParams()\r\n"+
        "\t    .append('data',`${JSON.stringify(_data)}`)\r\n"+
        "\t    .append('funNo','"+ row.functionNo+"');\r\n"+
        "\t  this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {\r\n"+
        "\t    if(data.status=='OK'){\r\n"+
        "\t      this.__listOf"+_fieldName+ " = data.rows; \r\n"+
        "\t    }\r\n"+
        "\t  })\r\n"+
        "\t}\r\n";
    }
    
    function ins_numberControl(row){
      var _CtrlHTML_FileName = "./src/designer/templates/SM-form-single-column-number-control.html";
      var _CtrlHTML= _fs.readFileSync(_CtrlHTML_FileName ,'utf8');
      var _label = row.label;
      var _fieldName = row.fieldName;
      _CtrlHTML=_CtrlHTML.replace(/%{label}%/g, _label);
      _CtrlHTML=_CtrlHTML.replace(/%{fieldName}%/g, _fieldName);
      var _visible="";
      if(row.visible){
        _visible = "*ngIf=\""+formatCorrection(row.visible)+"\"" ;
      }
      _CtrlHTML=_CtrlHTML.replace(/%{visible}%/g,_visible);
      _rowsHTML+="\r\n"+ _CtrlHTML;
      _formVariables +="\r\n\t__"+ _fieldName +"=0;";
      _formNewFormDataFunctionCode += "\r\n\t\tthis.__"+ _fieldName+"=0;";
      _formSaveFunctoinCode += "\r\n\t\t\t\t"+ _fieldName+": this.__"+_fieldName+",";
    }

    function ins_sequenceControl(row){
      var _CtrlHTML_FileName = "./src/designer/templates/SM-form-single-column-sequence-control.html";
      var _CtrlHTML= _fs.readFileSync(_CtrlHTML_FileName ,'utf8');
      var _label = row.label;
      var _fieldName = row.fieldName;
      _CtrlHTML=_CtrlHTML.replace(/%{label}%/g, _label);
      _CtrlHTML=_CtrlHTML.replace(/%{fieldName}%/g, _fieldName);
      var _visible="";
      if(row.visible){
        _visible = "*ngIf=\""+formatCorrection(row.visible)+"\"" ;
      }
      _CtrlHTML=_CtrlHTML.replace(/%{visible}%/g,_visible);
      _rowsHTML+="\r\n"+ _CtrlHTML;
      _formVariables +="\r\n\t__"+ _fieldName +"=\"\";";
      _formNewFormDataFunctionCode += "\r\n\t\tthis.getNext"+_fieldName+"();";
      _formSaveFunctoinCode += "\r\n\t\t\t\t"+ _fieldName+": this.__"+_fieldName+",";
      _formFunctions+="\r\n"+
      "\tgetNext"+_fieldName+"(){\r\n"+
      "\t  var _url= (<any>AppConfig).httpCallPath+\"/api/function\";\r\n"+
      "\t  var _data="+
      JSON.stringify(row.functionParameters)
      +";\r\n"+
      "\t  var _params = new HttpParams()\r\n"+
      "\t    .append('data',`${JSON.stringify(_data)}`)\r\n"+
      "\t    .append('funNo','"+ row.functionNo+"');\r\n"+
      "\t  this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {\r\n"+
      "\t    if(data.status=='OK'){\r\n"+
      "\t      this.__"+_fieldName+ " = data.rows[0].c0; \r\n"+
      "\t    }\r\n"+
      "\t  })\r\n"+
      "\t}\r\n";
    }

    function ins_radioButtonControl(row){
      var _CtrlHTML_FileName = "./src/designer/templates/SM-form-single-column-radioButton-control.html";
      var _CtrlHTML= _fs.readFileSync(_CtrlHTML_FileName ,'utf8');
      var _label = row.label;
      var _fieldName = row.fieldName;
      _CtrlHTML=_CtrlHTML.replace(/%{label}%/g, _label);
      _CtrlHTML=_CtrlHTML.replace(/%{fieldName}%/g, _fieldName);
      var _visible="";
      if(row.visible){
        _visible = "*ngIf=\""+formatCorrection(row.visible)+"\"" ;
      }
      _CtrlHTML=_CtrlHTML.replace(/%{visible}%/g,_visible);
      _rowsHTML+="\r\n"+ _CtrlHTML;
      _formVariables +="\r\n\t__"+ _fieldName +"=0;";
      _formVariables +="\r\n\t__options_"+ _fieldName +"=" + JSON.stringify(row.options)+";";
      _formNewFormDataFunctionCode += "\r\n\t\tthis.__"+ _fieldName+"="+row.default+";";
      _formSaveFunctoinCode += "\r\n\t\t\t\t"+ _fieldName+": this.__"+_fieldName+",";
    }

    function ins_calendarControl(row){
      var _CtrlHTML_FileName = "./src/designer/templates/SM-form-single-column-calendar-control.html";
      var _CtrlHTML= _fs.readFileSync(_CtrlHTML_FileName ,'utf8');
      var _label = row.label;
      var _fieldName = row.fieldName;
      _CtrlHTML=_CtrlHTML.replace(/%{label}%/g, _label);
      _CtrlHTML=_CtrlHTML.replace(/%{fieldName}%/g, _fieldName);
      var _visible="";
      if(row.visible){
        _visible = "*ngIf=\""+formatCorrection(row.visible)+"\"" ;
      }
      _CtrlHTML=_CtrlHTML.replace(/%{visible}%/g,_visible);
      _rowsHTML+="\r\n"+ _CtrlHTML;
      _formVariables +="\r\n\t__"+ _fieldName +"=Date();";
      _formNewFormDataFunctionCode += "\r\n\t\tthis.__"+ _fieldName+"=Date();";
      _formSaveFunctoinCode += "\r\n\t\t\t\t"+ _fieldName+": this.__"+_fieldName+",";
    }

    function onComplete(responseObj){
      //completed. send the result, error or success
//      if(!callbackFunction){
        this.__res.send(JSON.stringify(responseObj));          
//      }else{
//        callbackFunction(responseObj);  
//      }
      return;
    }

    function sendError(){
//      if(!callbackFunction){
        __this.__sendResponseCallback=null;
//      }else{
//        __this.__sendResponseCallback= callbackFunction;
//      }
      __this.__status='error';
      __this.sendResponse();
    }
  }
}
module.exports= SM_form;

