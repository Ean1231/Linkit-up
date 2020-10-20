import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BursariesPage } from './bursaries.page';

describe('BursariesPage', () => {
  let component: BursariesPage;
  let fixture: ComponentFixture<BursariesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BursariesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BursariesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
