import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlockComponent } from './block/block.component';
import { AddressComponent } from './address/address.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { HomeComponent } from './home/home.component';
import { TransactionComponent } from './transaction/transaction.component';

const routes: Routes = [{
  path: '', component: HomeComponent
}, {
  path: 'block/:blockNum', component: BlockComponent
}, {
  path: 'address/:address', component: AddressComponent
}, {
  path: 'transactions', component: TransactionsComponent
}, {
  path: 'transaction/:txHash', component: TransactionComponent
}, {
  path: '**', component: HomeComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
