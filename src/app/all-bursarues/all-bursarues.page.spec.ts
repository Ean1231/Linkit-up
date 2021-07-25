import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllBursaruesPage } from './all-bursarues.page';

describe('AllBursaruesPage', () => {
  let component: AllBursaruesPage;
  let fixture: ComponentFixture<AllBursaruesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllBursaruesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllBursaruesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
