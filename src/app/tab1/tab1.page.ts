import { Component } from '@angular/core';
import { Aps } from './aps';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';




@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  showUniversities = false;

  Universities = [
    new Aps ("Sol Plaaje University", "24", "teaching", "B.Degree", "Kimberley", "../../assets/Student_Safety_SPU_210119-WI-PT.jpg",{emal:"information@spu.ac.za" , Contact:"+27 (0)53 491 0000"},"https://www.spu.ac.za/", "The Sol Plaatje University, which had provisionally been referred to as the University of the Northern Cape, opened in Kimberley, South Africa, in 2014, accommodating a modest initial intake of 135 students. The student complement is expected to increase gradually towards a target of 7 500 students by 2024. Launched in a ceremony in Kimberley on 19 September 2013,[3] it had been formally established as a public university in terms of Section 20 of the Higher Education Act of 1997, by way of Government Notice 630, dated 22 August 2013.[4] Minister of Higher Education and Training, Blade Nzimande, observed at the launch that this “is the first new university (in South Africa) to be launched since 1994 and as such is a powerful symbol of the country’s democracy, inclusiveness, and growth. It represents a new order of African intellect, with a firm focus on innovation and excellence.",["Funza","cashLoans","mackeys loans"]),
    new Aps ("Sol Plaaje University", "20", "Management", "Diploma", "Kimberley", "../../assets/Student_Safety_SPU_210119-WI-PT.jpg", {emal:"information@spu.ac.za" , Contact:"+27 (0)53 491 0000"},"https://www.spu.ac.za/","The Sol Plaatje University, which had provisionally been referred to as the University of the Northern Cape, opened in Kimberley, South Africa, in 2014, accommodating a modest initial intake of 135 students. The student complement is expected to increase gradually towards a target of 7 500 students by 2024. Launched in a ceremony in Kimberley on 19 September 2013,[3] it had been formally established as a public university in terms of Section 20 of the Higher Education Act of 1997, by way of Government Notice 630, dated 22 August 2013.[4] Minister of Higher Education and Training, Blade Nzimande, observed at the launch that this “is the first new university (in South Africa) to be launched since 1994 and as such is a powerful symbol of the country’s democracy, inclusiveness, and growth. It represents a new order of African intellect, with a firm focus on innovation and excellence.", ["Funza","ivan loans"]),
    new Aps ("Sol Plaaje University", "30", "Data Science", "B.Degree", "Kimberley", "../../assets/Student_Safety_SPU_210119-WI-PT.jpg", {emal:"information@spu.ac.za" , Contact:"+27 (0)53 491 0000"},"https://www.spu.ac.za/","The Sol Plaatje University, which had provisionally been referred to as the University of the Northern Cape, opened in Kimberley, South Africa, in 2014, accommodating a modest initial intake of 135 students. The student complement is expected to increase gradually towards a target of 7 500 students by 2024. Launched in a ceremony in Kimberley on 19 September 2013,[3] it had been formally established as a public university in terms of Section 20 of the Higher Education Act of 1997, by way of Government Notice 630, dated 22 August 2013.[4] Minister of Higher Education and Training, Blade Nzimande, observed at the launch that this “is the first new university (in South Africa) to be launched since 1994 and as such is a powerful symbol of the country’s democracy, inclusiveness, and growth. It represents a new order of African intellect, with a firm focus on innovation and excellence.",["funza","thatoLoans"]),
    new Aps ("Boston City campus & business School", "20", "Management", "Diploma","Cape Town", "../../assets/Boston.jpg", {emal:"info@boston.ac.za" , Contact:"053 832 7273"},"https://www.boston.co.za/","'Boston City Campus offers relevant higher education qualifications that include a Postgraduate, Degrees, Diplomas, and Higher Certificates, as well as short courses developed by industry specialists and leading professionals. Boston approaches each student as an individual with tailored assistance, support, and advice for navigating the pathways to reaching their dreams. Boston City Campus has over 45 support centres throughout South Africa, more than 80 dynamic programme options, free career counselling, and tuition support.'", ["funza","prince Loans","stephanLoans"]),
    new Aps ("Boston City campus & business School", "30", "ICT", "diploma","Johannesburg", "../../assets/Boston.jpg", {emal:"info@boston.ac.za" , Contact:"053 832 7273"},"https://www.boston.co.za/","'Boston City Campus offers relevant higher education qualifications that include a Postgraduate, Degrees, Diplomas, and Higher Certificates, as well as short courses developed by industry specialists and leading professionals. Boston approaches each student as an individual with tailored assistance, support, and advice for navigating the pathways to reaching their dreams. Boston City Campus has over 45 support centres throughout South Africa, more than 80 dynamic programme options, free career counselling, and tuition support.'", ["funza","that man loans", "lucas loans"]),
    new Aps ("Boston City campus & business School", "25", "Financial Management", "Diploma", "Bloemfontein", "../../assets/Boston.jpg", {emal:"info@boston.ac.za" , Contact:"053 832 7273"},"https://www.boston.co.za/","'Boston City Campus offers relevant higher education qualifications that include a Postgraduate, Degrees, Diplomas, and Higher Certificates, as well as short courses developed by industry specialists and leading professionals. Boston approaches each student as an individual with tailored assistance, support, and advice for navigating the pathways to reaching their dreams. Boston City Campus has over 45 support centres throughout South Africa, more than 80 dynamic programme options, free career counselling, and tuition support.'", ["funza","that mahdh loans", "jdsj loans"]),
    new Aps ("Boston City campus & business School", "19", "Marketing", "diploma", "Johannesburg", "../../assets/Boston.jpg", {emal:"info@boston.ac.za" , Contact:"053 832 7273"},"https://www.boston.co.za/","'Boston City Campus offers relevant higher education qualifications that include a Postgraduate, Degrees, Diplomas, and Higher Certificates, as well as short courses developed by industry specialists and leading professionals. Boston approaches each student as an individual with tailored assistance, support, and advice for navigating the pathways to reaching their dreams. Boston City Campus has over 45 support centres throughout South Africa, more than 80 dynamic programme options, free career counselling, and tuition support.'", ["funza","that man loans", "lucas loans","ive boy loans","thato the queen"]),
    new Aps ("Boston City campus & business School", "28", "HR", "certificate", "Cape Town", "../../assets/Boston.jpg", {emal:"info@boston.ac.za" , Contact:"053 832 7273"},"https://www.boston.co.za/","'Boston City Campus offers relevant higher education qualifications that include a Postgraduate, Degrees, Diplomas, and Higher Certificates, as well as short courses developed by industry specialists and leading professionals. Boston approaches each student as an individual with tailored assistance, support, and advice for navigating the pathways to reaching their dreams. Boston City Campus has over 45 support centres throughout South Africa, more than 80 dynamic programme options, free career counselling, and tuition support.'", ["funza","Mackeyyy loans", "mackes loans"]),
    new Aps ("Northern cape FET College", "20", "financial management","certificate", "Kimberley", "../../assets/fet.jpg", {emal:"info@ncutvet.edu.za" , Contact:"(053) 839-2063"},"http://ncutvet.edu.za/","Subsequently, indications were given by the Northern Cape Department of Education that the three technical colleges should amalgamate. The first phase would incorporate the merging of the R C Elliott Technical College and the Moremogolo. Technical College into Kimberley College. The amalgamation of the 2 institutions was implemented as of January 1997.", ["funza","that man loans", "lucas loans"]),
    new Aps ("Northern cape FET College", "15", "Marketing","certificate", "Cape Town", "../../assets/fet.jpg", {emal:"info@ncutvet.edu.za" , Contact:"(053) 839-2063"},"http://ncutvet.edu.za/","Subsequently, indications were given by the Northern Cape Department of Education that the three technical colleges should amalgamate. The first phase would incorporate the merging of the R C Elliott Technical College and the Moremogolo. Technical College into Kimberley College. The amalgamation of the 2 institutions was implemented as of January 1997.", ["funza","that man loans", "lucas loans"]),
    new Aps ("Northern cape FET College", "25", "Engineering","certificate", "Bloemfontein", "../../assets/fet.jpg", {emal:"info@ncutvet.edu.za" , Contact:"(053) 839-2063"},"http://ncutvet.edu.za/","Subsequently, indications were given by the Northern Cape Department of Education that the three technical colleges should amalgamate. The first phase would incorporate the merging of the R C Elliott Technical College and the Moremogolo. Technical College into Kimberley College. The amalgamation of the 2 institutions was implemented as of January 1997.", ["funza", "","that man loans", "lucas loans"]),
  ]

                                //search for dropdownLists

    // options = [
    //   { value: "Kimberley", selected: false },
    //   { value: "Johannesburg", selected: false },
    //   { value: "Bloemfontein", selected: false },
    //   { value: "Cape Town", selected: false }
    // ];

    // selectedCity: any;
    // filterdOptions = [];
    // filterOptions() {
    //   this.filterdOptions = this.options.filter(
    //     item => item.value.toLowerCase().includes(this.selectedCity.toLowerCase())
    //   );
    //   console.log(this.filterdOptions);
    // }

  
  
  filterData(ev:any){
    const val = ev.target.value;
    if (val && val.trim() !=''){
      this.Universities = this.Universities.filter((item)=> {
        this.showUniversities =true;
        return (item.aps.toLowerCase().indexOf(val.toLowerCase())>-1 );
      })
    } 
    //clears searchbar if empty
    if (val == ''){
      this.showUniversities=false
    }else{
      
    }
    console.log(this.Universities)
  }

  submit(university){
  console.log(university);
  this.router.navigateByUrl("/details" , {state:university});
  }


  items: Observable<any[]>
  getData(){
    this.firestore.collection('Add').valueChanges().subscribe((items: any) => {
    this.items = items;
    console.log(items)
    })
    }
   


  doRefresh(event){
    console.log('RefreshPage');

    setTimeout(()=>{
      console.log('refresh has ended');
      event.target.complete();
    }, 1000);
  }

  

  constructor(public router: Router, private firestore: AngularFirestore, )
  {
    this.getData();

  }



}
