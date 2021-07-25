import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllOpportunitiesPage } from './all-opportunities.page';

describe('AllOpportunitiesPage', () => {
  let component: AllOpportunitiesPage;
  let fixture: ComponentFixture<AllOpportunitiesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllOpportunitiesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllOpportunitiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
