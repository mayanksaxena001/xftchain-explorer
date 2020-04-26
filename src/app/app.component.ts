import { Component, OnInit } from '@angular/core';
import { Web3Service } from './web3.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isConnected: Boolean = false;
  constructor(private web3Service: Web3Service, private router: Router) {
    console.log('Inside AppComponent...');
  }
  ngOnInit(): void {
    this.initData();
  }

  async initData() {
    try {
      //TODO: need to remove for latest versions
      this.isConnected = await this.web3Service.isConnected();
    } catch (error) {
      console.log(error);
    }
  }

  getText() {
    return this.isConnected ? 'Server Connected' : 'Server Offline'
  }

  searchInput(value: string) {
    if (!value) return;
    if (this.web3Service.validate_txhash(value)) {
      this.router.navigateByUrl('/transaction/' + value);
    }
    else if (this.web3Service.validate_addr(value)) {
      this.router.navigateByUrl('/address/' + value);
    }
    else if (this.web3Service.validate_block(value)) {
      this.router.navigateByUrl('/block/' + value);
    } else {
      this.homepage();
    }
  }

  homepage() {
    this.router.navigateByUrl('/');
  }
}
