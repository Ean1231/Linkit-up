import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ApSearchPage } from './ap-search.page';

describe('ApSearchPage', () => {
  let component: ApSearchPage;
  let fixture: ComponentFixture<ApSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ApSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
