import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { Web3Service } from './web3.service';
import { BlockComponent } from './block/block.component';
import { AddressComponent } from './address/address.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { HomeComponent } from './home/home.component';
import { TransactionComponent } from './transaction/transaction.component';

@NgModule({
  declarations: [
    AppComponent,
    BlockComponent,
    AddressComponent,
    TransactionsComponent,
    HomeComponent,
    TransactionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [Web3Service, { provide: "BASE_API_URL", useValue: environment.baseUrl }],
  bootstrap: [AppComponent]
})
export class AppModule { }
