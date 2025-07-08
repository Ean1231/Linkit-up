import { Component, OnInit } from '@angular/core';
import {ServiceService} from '../service.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-institutions',
  templateUrl: './institutions.page.html',
  styleUrls: ['./institutions.page.scss'],
})
export class InstitutionsPage implements OnInit {

  varsities = [];
  data:any;
  filteredData: any[] = [];
  searchTerm: string = '';

  constructor( public service: ServiceService, public router: Router) { 

    this.service.getVarsities().then((items:any)=>{
     // console.log(items);
      this.varsities = items;

    });
  }
  

  ngOnInit() {
    this.data = this.router.getCurrentNavigation().extras.state;
    console.log(this.data)
    this.filteredData = [...this.data];
  }

  searchInstitutions() {
    if (!this.searchTerm) {
      this.filteredData = [...this.data];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter(institution => {
      return (
        institution.institution?.toLowerCase().includes(searchTermLower) ||
        institution.location?.toLowerCase().includes(searchTermLower) ||
        institution.qualification?.toLowerCase().includes(searchTermLower)
      );
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredData = [...this.data];
  }

  details(data){
    console.log(data)
    this.router.navigateByUrl('/details', {state:data});
  }

}
