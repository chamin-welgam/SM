import {
  Directive,
  Input,
  HostBinding,
  ElementRef,
  Component, 
  OnInit 
} from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import * as  AppConfig from  '../../app/configuration/config.json';
import { now } from 'moment';
import {SM_webUtilities} from '../../webUtilities/SM_webUtilities';

@Component({
  selector : 'SM_FE_Form',   
  templateUrl: 'SM_FE_Form.component.html',
  providers: [ ],
  styleUrls    : [
    './style/index.less',
    './style/patch.less'
  ]
})

export class SM_FE_Form  implements OnInit {
  TEXT_CONTROL=3824;
  NUMBER_CONTROL=3825;
  DATE_CONTROL=3826;
  DDENUM_CONTROL=3829;
  //variables
  __formNo=31;
  __formName="";
  __title="";
  __fields=[];
  __el: HTMLElement;
  __SM_webUtilities : SM_webUtilities
  __data={};
  
  constructor(private el: ElementRef, private __http: HttpClient, private __activatedRoute: ActivatedRoute ,
              private __router :Router, 
  ) {
    this.__el = this.el.nativeElement;
    this.__activatedRoute.queryParams.subscribe(params => {
      this.__formNo= params['formNo'];
    });
    this.__SM_webUtilities = new SM_webUtilities(this.__http);
  }

  ngOnInit() {
    this.initForm();
  }

  //functions for initializing lists 

  //function to initialize form / create new
  initForm(){

    //get fields and add to screen
    var _data={
      F_FORM_NO: this.__formNo
    };
    var _SP_SM_GET_FORM_FIELDS = 260
    this.callFunction(_SP_SM_GET_FORM_FIELDS,_data, getFields.bind(this))

    function getFields(_data) 
    {
      if(_data.status=='OK'){
        _data.rows.forEach(_row => {
          this.__data["F_"+_row.c0]=null;   //CREAte variables to hold form data
        });
        this.__fields=_data.rows;
        this.getLists();
      }else{ //error //todo
        alert("Error \nwhile creating controls");
      }  
    }
  }

  __IndexNo=0;
  __F_ID=0;
  __lists={};
  getLists(){
    if(this.__IndexNo>=this.__fields.length)
      return;
    if(this.__fields[this.__IndexNo].c2==this.DDENUM_CONTROL){
      this.__F_ID= this.__fields[this.__IndexNo].c0;
      var _data={
        enumGrpID: 111
      };
      this.callFunction(9,_data, this.onListData.bind(this))
    } else {
      this.__IndexNo++;
      this.getLists();
    }
  }

  onListData(_data){
    if(_data.status=='OK'){
      this.__lists["F_"+this.__F_ID ]=_data.rows;
    }
    this.__IndexNo++;
    this.getLists();
  }


  callFunction(_funNo, _data, _callBackFunc){
    this.__SM_webUtilities.callAPIFunction(_funNo, _data,_callBackFunc, this.__http);
   /*  var _url= (<any>AppConfig).httpCallPath+"/api/function";
      
    var _params = new HttpParams()
      .append('funNo', `${_funNo}`)
      .append('data', `${JSON.stringify(_data)}`);
    this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => _callBackFunc(data));   */
  }

  //function to save save / save button click
  save(){
    var _data={
      F_FORM_NO: this.__formNo
    };
    for (var _dt in this.__data) {
      _data[_dt]=this.__data[_dt];   //CREAte variables to hold form data
    };
    var _SaveFunNumber = 175;
    this.callFunction(_SaveFunNumber ,_data, this.onSaveComplete.bind(this))
  }

  onSaveComplete(_data){
    if(_data.status=='OK'){
      alert("saved!!");
    }else{ //error //todo
      alert("Error \nwhile saving");
    }  
  }
}

