import { Component, OnInit } from '@angular/core';
import { Web3Service } from './web3.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isConnected: Boolean = false;
  waiting = false;
  networks: { name: String, url: String }[];
  selectedNetwork:String = "";
  constructor(private web3Service: Web3Service, private router: Router) {
    console.log('Inside AppComponent...');
  }
  ngOnInit(): void {
    this.initData();
  }

  async initData() {
    try {
      //TODO: need to remove for latest versions
      this.networks = await this.web3Service.getAvailableNetworkList();
      await this.checkNetwork();
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

  async selectNetwork(selectedNetwork){
    console.log('Selecting a network ',selectedNetwork);
    if (selectedNetwork){
      this.selectedNetwork = selectedNetwork;
      await this.web3Service.changeNetwork(selectedNetwork);
      await this.checkNetwork();
    }
  }

  async checkNetwork(){
    this.isConnected = await this.web3Service.isConnected();
    this.waiting = this.isConnected ? false:true;
    if(this.isConnected){
      this.selectedNetwork = this.networks.find(e => e.url == environment.baseUrl).name;
    }
  }
}
