import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { ButtonsComponent } from './buttons.component';
//import { CardsComponent } from './cards.component';
//import { ModalsComponent } from './modals.component';
//import { SocialButtonsComponent } from './social-buttons.component';
//import { SwitchesComponent } from './switches.component';
//import { TablesComponent } from './tables.component';
//import { TabsComponent } from './tabs.component';

import { TransactionsReportComponent } from './transactions-report.component';
import { chequesInHandComponent } from './chequesInHand.component';
import { expenseVoucherComponent } from './expenseVoucher.component';
import { Purchase_VouchersComponent } from './Purchase_Vouchers.component';
import { journalVoucherComponent } from './journalVoucher.component';
import { ReceiptVoucherComponent } from './ReceiptVoucher.component';
import { PaymentVoucherComponent } from './PaymentVoucher.component';
import { InvoiceComponent } from './Invoice.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Accounting'
    },
    children: [
      {
        path: 'transactions',
        component: TransactionsReportComponent,
        data: {
          title: 'Transactions / Ledger report'
        }
      },      {
        path: 'chequesInHand',
        component: chequesInHandComponent,
        data: {
          title: 'Cheques in Hand'
        }
      },      {
        path: 'expenseVoucher',
        component: expenseVoucherComponent,
        data: {
          title: 'Expense Voucher'
        }
      },      {
        path: 'purchaseVoucher',
        component: Purchase_VouchersComponent,
        data: {
          title: 'Purchase Voucher'
        }
      },      {
        path: 'journalVoucher',
        component: journalVoucherComponent,
        data: {
          title: 'Journal Voucher'
        }
      },{
        path: 'receiptVoucher',
        component: ReceiptVoucherComponent,
        data: {
          title: 'Receipt Voucher'
        }
      },{
        path: 'paymentVoucher',
        component: PaymentVoucherComponent,
        data: {
          title: 'Payment Voucher'
        }
      },      {
        path: 'invoiceVoucher',
        component: InvoiceComponent,
        data: {
          title: 'Invoice Voucher'
        }
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule {}
