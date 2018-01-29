import { Component, OnInit } from '@angular/core';
//import { NgZorroAntdModule } from '../../../index.showcase';

@Component({
  selector : 'test-app',  
  templateUrl: 'testApp.component.html',
  providers: [],
})
export class testAppComponent   {
  example =  new Date(2013, 9, 22) ;
}
