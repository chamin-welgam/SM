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
import { AccountingRoutingModule } from './accounting-routing.module';

// Forms Component
import { TransactionsReportComponent } from './transactions-report.component';
import { chequesInHandComponent } from './chequesInHand.component';
import { expenseVoucherComponent } from './expenseVoucher.component';
import { Purchase_VouchersComponent } from './Purchase_Vouchers.component';
import { journalVoucherComponent } from './journalVoucher.component';
import { ReceiptVoucherComponent } from './ReceiptVoucher.component';
import { PaymentVoucherComponent } from './PaymentVoucher.component';
import { InvoiceComponent } from './Invoice.component';

@NgModule({
  imports: [
    AccountingRoutingModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    
    NgZorroAntdModule
    
  ],
  declarations: [
    TransactionsReportComponent,
    chequesInHandComponent,
    expenseVoucherComponent,
    Purchase_VouchersComponent,
    journalVoucherComponent,
    ReceiptVoucherComponent,
    PaymentVoucherComponent,
    InvoiceComponent
    
  ],
  providers   : [
    { provide: NZ_LOGGER_STATE, useValue: true },
    { provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 3000 } },
    { provide: NZ_NOTIFICATION_CONFIG, useValue: { nzTop: '20px' } },
    { provide: NZ_LOCALE, useValue: enUS },
    Title,
  ],
})
export class AccountingModule { }
