import { Injectable, Inject, OnDestroy, OnInit } from '@angular/core';
import Web3 from 'web3';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Web3Service implements OnDestroy {
  
  MAX_BLOCKS:number = 10;
  latestBlockNum: number = undefined;
  private pendingBlocksSource = new Subject<any>();
  updatePendingBlocks = this.pendingBlocksSource.asObservable();
  subscription: any;
  networks: {name:String,url:String}[];

  constructor(@Inject('WEB3') private web3: Web3) {
    console.log('Inside Web3Service...');
    try{
      this.latestBlockNum = this.web3.eth.blockNumber;
      setInterval(() => this.updateBlocks(), 10000);
    }catch(e){console.error(e);}
    // this.filterLatestBlock();
  }

  ngOnDestroy(): void {
  }

  async setBlockNumber(){
    
  }
  async getLatestblockNumber(){
    return this.latestBlockNum;
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

  async getAvailableNetworkList(){
    this.networks = [{ name: "XFT Chain", url: "https://api.xftchain.club/" }, { name: "Localhost", url: "http://localhost:8545" }, { name: "Infura Mainnet", url: 'https://mainnet.infura.io/v3/bd04aa365dfb4509a573a8ccdd6b3b50' }];
    return this.networks;
  }

  async isConnected() {
    let isConnected = await this.web3.isConnected();
    if(isConnected) console.log('Connected to network');
    else console.log('disconnected from network');
    return isConnected;
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
    let blockNum = this.latestBlockNum;
    if (blockNum > 0) {
      for (var i = 0; i < this.MAX_BLOCKS; i++) {
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

  async changeNetwork(selectedNetwork: any) {
    if(selectedNetwork){
      try {
        if(this.networks){
          let network=this.networks.find(e => e.name==selectedNetwork);
          if(network){
            const currentProvider = new Web3.providers.HttpProvider(network.url);
            // ('ethereum' in window) ? window['ethereum'] : 
            const provider = currentProvider;
            this.web3 =  await new Web3(provider);
            this.updateBlocks();
          }
        }
      } catch (err) {
        throw new Error('Non-Ethereum browser detected. You should consider trying Mist or MetaMask!');
      }
    }
  }
}
