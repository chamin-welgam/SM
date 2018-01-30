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
import { SM_VisualDesignerRoutingModule } from './SM_VisualDesignerModule-routing.module';

// Forms Component
import { SM_VD_FormCreatorComponent } from './SM_VD_FormCreator.component';
import { SM_VD_FormDesignerComponent } from './SM_VD_FormDesigner.component';
import { SM_VD_FormPropertyComponent } from './SM_VD_FormProperty.component';
import { SM_VD_TextControlPropertyComponent } from './SM_VD_TextControlProperty.component';
import { SM_VD_NumberControlPropertyComponent } from './SM_VD_NumberControlProperty.component';
import { SM_VD_DateControlPropertyComponent } from './SM_VD_DateControlProperty.component';
import { SM_VD_DDEnumControlPropertyComponent } from './SM_VD_DDEnumControlProperty.component';
import { SM_VD_DDReferenceControlPropertyComponent } from './SM_VD_DDReferenceControlProperty.component';

@NgModule({
  imports: [
    SM_VisualDesignerRoutingModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    
    NgZorroAntdModule
    
  ],
  declarations: [
    SM_VD_FormCreatorComponent, SM_VD_FormDesignerComponent,
    SM_VD_FormPropertyComponent, SM_VD_TextControlPropertyComponent
    ,SM_VD_NumberControlPropertyComponent
    ,SM_VD_DateControlPropertyComponent
    ,SM_VD_DDEnumControlPropertyComponent
    ,SM_VD_DDReferenceControlPropertyComponent

  ],
  providers   : [
    { provide: NZ_LOGGER_STATE, useValue: true },
    { provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 3000 } },
    { provide: NZ_NOTIFICATION_CONFIG, useValue: { nzTop: '20px' } },
    { provide: NZ_LOCALE, useValue: enUS },
    Title,
  ],
})
export class SM_VisualDesignerModule { }
