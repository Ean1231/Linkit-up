import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ap-score',
  templateUrl: './ap-score.page.html',
  styleUrls: ['./ap-score.page.scss'],
})
export class ApScorePage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

}
