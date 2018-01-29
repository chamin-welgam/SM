import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { HttpModule  } from '@angular/http';
import { HttpClientModule } from  '@angular/common/http'  

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
//import { ModalsComponent } from './modals.component';

// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';
//import { TabsComponent } from './tabs.component';

//commponents
import { 
  NgZorroAntdModule, 

  NZ_MESSAGE_CONFIG,   
  NZ_NOTIFICATION_CONFIG  ,
  NZ_LOGGER_STATE,
  NZ_LOCALE,
  enUS
} from '../../../index.showcase';

// Components Routing
import { salesRoutingModule } from './sales-routing.module';

// Forms Component
//import { InvoiceComponent } from './Invoice.component';

@NgModule({
  imports: [
    salesRoutingModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    
    NgZorroAntdModule
    
  ],
  declarations: [
  //  InvoiceComponent
  ],
  providers   : [
    { provide: NZ_LOGGER_STATE, useValue: true },
    { provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 3000 } },
    { provide: NZ_NOTIFICATION_CONFIG, useValue: { nzTop: '20px' } },
    { provide: NZ_LOCALE, useValue: enUS },
    Title,
  ],
})
export class salesModule { }
