import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { Web3Service } from './web3.service';
import { BlockComponent } from './block/block.component';
import { AddressComponent } from './address/address.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { HomeComponent } from './home/home.component';
import { TransactionComponent } from './transaction/transaction.component';

import Web3 from 'web3';
// Create an Injection Token with web3 inside
export const WEB3 = new InjectionToken<Web3>('web3');

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
  providers: [Web3Service, {
    provide: 'WEB3',
    useFactory: () => {
      try {
        const currentProvider = new Web3.providers.HttpProvider(environment.baseUrl);
        // ('ethereum' in window) ? window['ethereum'] : 
        const provider = currentProvider;
        return new Web3(provider);
      } catch (err) {
        throw new Error('Non-Ethereum browser detected. You should consider trying Mist or MetaMask!');
      }
    },
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
