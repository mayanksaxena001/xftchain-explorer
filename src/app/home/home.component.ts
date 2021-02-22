import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Web3Service } from '../web3.service';
import { Subscription } from 'rxjs';
import { Output } from '@angular/core';
import { Input } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  blocks: any = [];
  isConnected: Boolean = false;
  subscription: Subscription;
  pageList:any = [1];
  pageNumber: number = 1;
  MAX_BLOCKS: number = 10;
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
      if(this.isConnected){
        this.blocks = await this.web3Service.getBlocks();
        this.updatePagination();
        this.subscription = this.web3Service.updatePendingBlocks.subscribe(blocks => {
          if (blocks && blocks.length) {
            this.blocks = blocks;
            this.updatePagination();
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updatePagination(){
    const blockNumber = await this.web3Service.getLatestblockNumber();
    if(blockNumber > 0){
      const pages= Math.ceil(blockNumber/this.MAX_BLOCKS);
      this.pageList = [];
      for (let i = 1; i <= pages; i++) {
        this.pageList.push(i);      
      }
    }
  }

  async onPageClick(pageNum){
    if(pageNum > 0){
      this.blocks = [];
      this.pageNumber = pageNum;
      const latestBlockNum = await this.web3Service.getLatestblockNumber();
      const blockNumber=latestBlockNum - Math.imul(pageNum,this.MAX_BLOCKS);
      for (var i = this.MAX_BLOCKS; i > 0; i--) {
        if (blockNumber + i > 0) this.blocks.push(await this.web3Service.getBlock(blockNumber+i ));
      }
    }
  }

  async onNextClick(){
    if(this.pageNumber){
      this.pageNumber = this.pageNumber + 1;
      await this.onPageClick(this.pageNumber);
    }
  }

  async onPreviousClick(){
    if (this.pageNumber) {
      this.pageNumber = this.pageNumber - 1;
      await this.onPageClick(this.pageNumber);
    }
  }

  async onFirstClick(){
    if (this.pageNumber ) {
      this.pageNumber = 1;
      await this.onPageClick(this.pageNumber);
    }
  }

  async onLastClick() {
    if (this.pageNumber) {
      this.pageNumber = this.pageList.length;
      await this.onPageClick(this.pageNumber);
    }
  }

}
