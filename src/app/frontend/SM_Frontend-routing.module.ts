import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { ButtonsComponent } from './buttons.component';
//import { CardsComponent } from './cards.component';
//import { ModalsComponent } from './modals.component';
//import { SocialButtonsComponent } from './social-buttons.component';
//import { SwitchesComponent } from './switches.component';
//import { TablesComponent } from './tables.component';
//import { TabsComponent } from './tabs.component';

import { SM_FE_Form } from './SM_FE_Form.component';
//import { SM_VD_FormDesignerComponent } from './SM_VD_FormDesigner.component';
//import { SM_VD_FormPropertyComponent } from './SM_VD_FormProperty.component';
//import { SM_VD_TextControlPropertyComponent } from './SM_VD_TextControlProperty.component';

const routes: Routes = [
  {
    path: ':ID',
    component: SM_FE_Form
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SM_FrontendRoutingModule {}
