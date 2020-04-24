import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../web3.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: any[];
  isConnected: Boolean = false;

  constructor(private route: ActivatedRoute, private web3Service: Web3Service) { console.log('Inside TransactionsComponent'); }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let blockNumber = params['blockNum'];
      this.initBlock(blockNumber);
    });
  }
  async initBlock(blockNumber: any) {
    this.isConnected = await this.web3Service.isConnected();
    this.transactions = await this.web3Service.getTransactions(blockNumber);
  }

}
