import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { ButtonsComponent } from './buttons.component';
//import { CardsComponent } from './cards.component';
//import { ModalsComponent } from './modals.component';
//import { SocialButtonsComponent } from './social-buttons.component';
//import { SwitchesComponent } from './switches.component';
//import { TablesComponent } from './tables.component';
//import { TabsComponent } from './tabs.component';

import { SM_VD_FormCreatorComponent } from './SM_VD_FormCreator.component';
import { SM_VD_FormDesignerComponent } from './SM_VD_FormDesigner.component';
import { SM_VD_FormPropertyComponent } from './SM_VD_FormProperty.component';
import { SM_VD_TextControlPropertyComponent } from './SM_VD_TextControlProperty.component';
import { SM_VD_NumberControlPropertyComponent } from './SM_VD_NumberControlProperty.component';
import { SM_VD_DateControlPropertyComponent } from './SM_VD_DateControlProperty.component';
import { SM_VD_DDEnumControlPropertyComponent } from './SM_VD_DDEnumControlProperty.component';
import { SM_VD_DDReferenceControlPropertyComponent } from './SM_VD_DDReferenceControlProperty.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'formDesigner/:formNo',
        component: SM_VD_FormDesignerComponent,
        children:[
          { path: 'formNo/:formNo',  
            component: SM_VD_FormPropertyComponent,
            outlet: 'prop'},
          { path: 'TextControl/:controlID',  
            component: SM_VD_TextControlPropertyComponent,
            outlet: 'prop'},
          { path: 'NumberControl/:controlID',  
            component: SM_VD_NumberControlPropertyComponent,
            outlet: 'prop'},
          { path: 'DateControl/:controlID',  
            component: SM_VD_DateControlPropertyComponent,
            outlet: 'prop'},
          { path: 'DDEnumControl/:controlID',  
            component: SM_VD_DDEnumControlPropertyComponent,
            outlet: 'prop'},
          { path: 'DDReferenceControl/:controlID',  
            component: SM_VD_DDReferenceControlPropertyComponent,
            outlet: 'prop'}
        ] 
      },{
        path: 'newForm',
        component: SM_VD_FormCreatorComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SM_VisualDesignerRoutingModule {}
