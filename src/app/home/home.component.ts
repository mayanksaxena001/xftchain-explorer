import { Component, OnInit, OnDestroy } from '@angular/core';
import { Web3Service } from '../web3.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  blocks: any = [];
  isConnected: Boolean = false;
  constructor(private web3Service: Web3Service) { }

  ngOnInit(): void {
    this.initData();
  }

  ngOnDestroy() {
    // this.web3Service.getWeb3().eth.unsubscribe(function (error, success) {
    //   if (success)
    //     console.log('Successfully unsubscribed!');
    // });
  }

  async initData() {
    try {
      //TODO: need to remove for latest versions
      this.isConnected = await this.web3Service.isConnected();
      this.blocks = await this.web3Service.getBlocks();
      let blockFilter = this.web3Service.filterLatestBlock();
      // blockFilter.watch(this.subscription);
    } catch (error) {
      console.log(error);
    }
  }
  subscription(err: any, result: any): any {
    if (err) console.log(err);
    else {
      var block = this.web3Service.getBlock(result.blockNumber);
      this.blocks.push(block);
    }
  }

}
