import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router' ;

@Component({
  selector: 'app-bursaries',
  templateUrl: './bursaries.page.html',
  styleUrls: ['./bursaries.page.scss'],
})
export class BursariesPage implements OnInit {
  bursaries;

  constructor(public router: Router) { }

  ngOnInit() {
    this.bursaries = this.router.getCurrentNavigation().extras.state;
    console.log(this.bursaries)
  }

}

