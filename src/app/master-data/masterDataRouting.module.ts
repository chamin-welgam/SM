import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Accounts_MasterComponent } from './Accounts_Master.component';
import { CustomerMasterComponent } from './CustomerMaster.component';
import { SuppliersComponent } from './Suppliers.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Master Data'
    },
    children: [
      {
        path: 'AccountsMaster',
        component: Accounts_MasterComponent,
        data: {
          title: 'Accounts'
        }
      },{
        path: 'CustomerMaster',
        component: CustomerMasterComponent,
        data: {
          title: 'Accounts'
        }
      },{
        path: 'SupplierMaster',
        component: SuppliersComponent,
        data: {
          title: 'Suppliers'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDataRoutingModule {}
