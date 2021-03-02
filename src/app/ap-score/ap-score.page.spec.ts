import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ApScorePage } from './ap-score.page';

describe('ApScorePage', () => {
  let component: ApScorePage;
  let fixture: ComponentFixture<ApScorePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApScorePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ApScorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
