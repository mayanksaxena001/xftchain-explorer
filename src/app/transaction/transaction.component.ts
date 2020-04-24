import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../web3.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  transaction: any = [];
  constructor(private route: ActivatedRoute, private web3Service: Web3Service) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let txHash = params.get('txHash');
      this.initTx(txHash);
    });
  }
  async initTx(txHash: string) {
    this.transaction = await this.web3Service.getTransaction(txHash);
  }

}
