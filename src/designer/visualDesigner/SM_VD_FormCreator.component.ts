import {
  Directive,
  Input,
  HostBinding,
  ElementRef,
  Component, 
  OnInit 
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { HttpClient, HttpParams} from '@angular/common/http';
import * as  AppConfig from  '../../app/configuration/config.json';
import { SM_webUtilities } from '../../webUtilities/SM_webUtilities';
import { now } from 'moment';

@Component({
  selector : 'SM_VD_FormCreator',  
  templateUrl: 'SM_VD_FormCreator.component.html',
  providers: [ ],
  styleUrls    : [
    './style/index.less',
    './style/patch.less'
  ]
})

export class SM_VD_FormCreatorComponent  implements OnInit {
  //variables
  __el: HTMLElement;
  __SMWU = new SM_webUtilities(this.__http);
  //new form variables
  __formName="";  
  __title="";
  //form names table's variables
  __currentPage = 1;
  __pageSize = 10;
  __totalPages = 1;
  __totalRecords=1000;
  __dataSet = [];
  __loading = false;
  __searchFormName="";
  __sortDirection=1;
    
  constructor(private el: ElementRef, private __http: HttpClient, private __router: Router, 
      private __route: ActivatedRoute) {
    this.__el = this.el.nativeElement;
  }

  ngOnInit() {
    this.newFormData();
    //get list of form names
    var _data={};
    var _callBack_fun = onReturnData.bind(this);
    this.__SMWU.callAPIFunction(295, _data, _callBack_fun);    
    
    function onReturnData(_data) {
      if(_data.status=='OK'){
        this.__dataSet= _data.rows;
        this.__totalRecords= _data.rows.length;
        this.__totalPages = Math.ceil( this.__totalRecords/this.__pageSize );
      }else{ //error //todo
        alert("Error \nwhile creating control");
      }  
    }        
    console.log(this.__router);
  }

  //function to initialize form / create new
  newFormData(){
    this.__formName="";
    this.__title="";
  }

  //sorting table data
  onSortChange(){
    this.__sortDirection *=-1;
    this.__dataSet.sort( (item1, item2)=>{
      let _retVal=1;
      if (this.__sortDirection==1){
        _retVal= item1.c1<item2.c1 ? 1:-1;
      }else {
        _retVal= item1.c1>item2.c1 ? 1:-1;
      }
      return _retVal;
    });
    this.__currentPage = 100;
    this.__currentPage = 1;
  }

  onCellClick(_formID){
    this.__router.navigate([_formID], {relativeTo: this.__route});
  }
  //function to save save / save button click
  save(){
    var _url= (<any>AppConfig).httpCallPath+"/api/function";
    var _funNo=154;
    var _data={
        FORM_NAME: this.__formName,
        TITLE:this.__title
      };
      
    this.__SMWU.callAPIFunction(_funNo,_data,onCallback.bind(this));

    function onCallback(_data1){
      if(_data1.status=='OK'){
          alert("SUCCESSFUL.");
          this.__router.navigate(['/designer/formDesigner',{formNo:_data1.rows[0].c0}]);
  //        this.newFormData();
      }else{ //error //todo
          alert("Error \nwhile getting data \nfrom server.");
      }  
    }
  }

}