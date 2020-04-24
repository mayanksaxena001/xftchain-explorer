import { Injectable, Inject } from '@angular/core';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private web3: any;
  private currentProvider: any;
  constructor(@Inject('BASE_API_URL') private baseUrl: string) {
    // if (typeof window.web3 !== 'undefined') {
    //   this.web3 = new Web3(window.web3.currentProvider)
    // } else {
    // }
    console.log('Inside Web3Service...', this.baseUrl);
    this.currentProvider = new Web3.providers.HttpProvider(this.baseUrl);
    this.web3 = new Web3(this.currentProvider);
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

  getWeb3() {
    return this.web3;
  }

  async getBlocks() {
    let blocks = [];
    let MAX_BLOCKS = 15;
    let blockNum = parseInt(this.web3.eth.blockNumber, 10);
    if (blockNum > 0) {
      for (var i = blockNum; (MAX_BLOCKS - i) > 0; i--) {
        blocks.push(await this.getBlock(i));
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

  filterLatestBlock() {
    return this.web3.eth.filter({ toBlock: 'latest' });
  }
}
