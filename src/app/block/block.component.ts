import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from '../web3.service';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockComponent implements OnInit {
  block: any = [];
  transactions: any = [];
  constructor(private route: ActivatedRoute, private web3Service: Web3Service) {
    console.log('Inside BlockComponent');
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let blockNumber = params.get('blockNum');
      this.initBlock(blockNumber);
    });

  }
  async initBlock(blockNumber: string) {
    this.block = await this.web3Service.getBlock(blockNumber);
    this.transactions = await this.web3Service.getTransactions(blockNumber);
  }

}
