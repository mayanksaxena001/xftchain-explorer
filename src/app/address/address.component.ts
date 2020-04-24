import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../web3.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  address: any = {};

  constructor(private route: ActivatedRoute, private web3Service: Web3Service) { console.log('Inside AddressComponent'); }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.address.address = params.get('address');
      this.initData();
    });
  }
  initData() {
    try {
      let balance = this.web3Service.getBalance(this.address.address);
      this.address.balanceWei = balance;
      this.address.balanceEth = balance / 1000000000000000000;
    } catch (error) {
      console.log(error);
    }
  }

}
