import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'icons',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'frontend-form',
        loadChildren: './frontend/SM_Frontend.module#SM_FrontendModule'        
      },{
        path: 'master-data',
        loadChildren: './master-data/masterData.module#masterDataModule'
      },{
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'accounting',
        loadChildren: './accounting/accounting.module#AccountingModule'
      },
      {
        path: 'sales',
        loadChildren: './sales/sales.module#salesModule'
      },
      {
        path: 'designer',
        loadChildren: '../designer/visualDesigner/SM_VisualDesignerModule.module#SM_VisualDesignerModule'
      },
/*      {
        path: 'charts',
        loadChildren: './chartjs/chartjs.module#ChartJSModule'
      } */
    ]
  }
  /* ,{
    path: 'pages',
    component: SimpleLayoutComponent,
    data: {
      title: 'Pages'
    },
    children: [
      {
        path: '',
        loadChildren: './pages/pages.module#PagesModule',
      }
    ]
  } */
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
