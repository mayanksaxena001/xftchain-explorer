import { Component, OnInit, OnDestroy } from '@angular/core';
import { Web3Service } from '../web3.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  blocks: any = [];
  isConnected: Boolean = false;
  subscription: Subscription;
  constructor(private web3Service: Web3Service) { }

  ngOnInit(): void {
    this.initData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async initData() {
    try {
      //TODO: need to remove for latest versions
      this.isConnected = await this.web3Service.isConnected();
      this.blocks = await this.web3Service.getBlocks();
      this.subscription = this.web3Service.updatePendingBlocks.subscribe(blocks => {
        if (blocks) this.blocks = blocks;
      });
    } catch (error) {
      console.log(error);
    }
  }
}
