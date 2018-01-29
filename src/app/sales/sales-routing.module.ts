import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { ButtonsComponent } from './buttons.component';
//import { CardsComponent } from './cards.component';
//import { ModalsComponent } from './modals.component';
//import { SocialButtonsComponent } from './social-buttons.component';
//import { SwitchesComponent } from './switches.component';
//import { TablesComponent } from './tables.component';
//import { TabsComponent } from './tabs.component';

//import { InvoiceComponent } from './Invoice.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Sales'
    },
    children: [
/*       {
        path: 'invoice',
        component: ,
        data: {
          title: 'Invoice'
        }
      }
      */
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class salesRoutingModule {}
