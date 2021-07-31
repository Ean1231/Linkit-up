import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router' ;
import { ServiceService } from '../service.service'

@Component({
  selector: 'app-bursaries',
  templateUrl: './bursaries.page.html',
  styleUrls: ['./bursaries.page.scss'],
})
export class BursariesPage implements OnInit {
  bursaries;
  showdata: any;
  constructor(public router: Router, public service: ServiceService) { }

  ngOnInit() {
    this.showdata = this.router.getCurrentNavigation().extras.state;
    console.log(this.showdata)   
    this.service.getBursaries();
  }

}

