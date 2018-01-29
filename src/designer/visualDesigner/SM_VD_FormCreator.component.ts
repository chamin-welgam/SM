import {
  Directive,
  Input,
  HostBinding,
  ElementRef,
  Component, 
  OnInit 
} from '@angular/core';
import {Router} from '@angular/router';
import { HttpClient, HttpParams} from '@angular/common/http';
import * as  AppConfig from  '../../app/configuration/config.json';
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
  __formName="";
  __title="";
  __el: HTMLElement;
  
  constructor(private el: ElementRef, private __http: HttpClient, private __router: Router) {
    this.__el = this.el.nativeElement;
  }

  ngOnInit() {
    this.newFormData();
    console.log(this.__router);
  }

  //functions for initializing lists 

  //function to initialize form / create new
  newFormData(){
    this.__formName="";
    this.__title="";
  }

  //function to save save / save button click
  save(){
    var _url= (<any>AppConfig).httpCallPath+"/api/function";
    var _funNo=154;
    var _data={
        FORM_NAME: this.__formName,
        TITLE:this.__title
      };
      
    var _params = new HttpParams()
      .append('funNo', `${_funNo}`)
      .append('data', `${JSON.stringify(_data)}`);
    this.__http.get(`${_url}`,{params: _params}).subscribe((data : any) => {
      if(data.status=='OK'){
        alert("SUCCESSFUL.");
        this.__router.navigate(['/designer/formDesigner',{formNo:data.rows[0].c0}]);
 //        this.newFormData();
       }else{ //error //todo
        alert("Error \nwhile getting data \nfrom server.");
      }  
    });  
  }

}

