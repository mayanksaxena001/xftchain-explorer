import { Injectable, Inject, OnDestroy, OnInit } from '@angular/core';
import Web3 from 'web3';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Web3Service implements OnDestroy {
  latestBlockNum: number = undefined;
  private pendingBlocksSource = new Subject<any>();
  updatePendingBlocks = this.pendingBlocksSource.asObservable();
  subscription: any;

  constructor(@Inject('WEB3') private web3: Web3) {
    console.log('Inside Web3Service...');
    this.latestBlockNum = this.web3.eth.blockNumber;
    setInterval(() => this.updateBlocks(), 10000);
    // this.filterLatestBlock();
  }

  ngOnDestroy(): void {
  }

  async updateBlocks() {
    const blockNum = this.web3.eth.blockNumber;
    if (this.latestBlockNum === blockNum) {
      return;
    }
    this.latestBlockNum = blockNum;
    let blocks = await this.getBlocks();
    this.pendingBlocksSource.next(blocks);
  }

  async isConnected() {
    return await this.web3.isConnected();
  }

  getBalance(address: string): any {
    if (!this.web3.isAddress(address)) {
      throw new Error('Not a valid Address');
    }
    return this.web3.eth.getBalance(address);
  }

  //TODO: get limited blocks
  async getBlocks() {
    let blocks = [];
    let MAX_BLOCKS = 15;
    let blockNum = this.latestBlockNum;
    if (blockNum > 0) {
      for (var i = 0; i < MAX_BLOCKS; i++) {
        blocks.push(await this.getBlock(blockNum - i));
      }
    }
    return blocks;
  }

  async getBlock(num: any) {
    let block = await this.web3.eth.getBlock(num);
    return this.formatBlock(block);
  }

  async getTransaction(txHash: any) {
    let transaction = await this.web3.eth.getTransaction(txHash);
    let block = await this.web3.eth.getBlock(transaction.blockNumber);
    transaction.gasPrice = transaction.gasPrice.c[0];
    transaction.txPrice = ((transaction.gas * transaction.gasPrice) / 1000000000000000000) + " ETH";
    let date = new Date(0);
    date.setUTCSeconds(block.timestamp);
    transaction.timestamp = (date.toLocaleDateString() + "," + date.toLocaleTimeString());
    transaction.value = transaction.value.c[0] / 10000 + " ETH";
    return transaction;
  }

  async getTransactions(blockNum: string) {
    let transactions = [];
    let block = await this.web3.eth.getBlock(blockNum);
    let transactonsHash = block.transactions;;
    for (var i = 0; i < transactonsHash.length; i++) {
      let transaction = await this.getTransaction(transactonsHash[i]);
      transactions.push(transaction);
    }
    return transactions;
  }

  formatBlock(block: any) {
    let _block = block;
    //format date
    let date = new Date(0);
    date.setUTCSeconds(block.timestamp);
    _block.timestamp = (date.toLocaleDateString() + "," + date.toLocaleTimeString());
    _block.difficulty = block.difficulty.c[0];
    _block.totalDifficulty = block.totalDifficulty.c[0];
    return _block;
  }

  validate_txhash(addr: string) {
    return /^0x([A-Fa-f0-9]{64})$/.test(addr);
  }

  validate_addr(addr: string) {
    return this.web3.isAddress(addr);
  }

  validate_block(value) {
    const blockNum = Number.isInteger(parseInt(value));
    return this.web3.eth.blockNumber >= blockNum;
  }
}
