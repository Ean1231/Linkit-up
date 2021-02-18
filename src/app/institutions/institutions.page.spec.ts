import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InstitutionsPage } from './institutions.page';

describe('InstitutionsPage', () => {
  let component: InstitutionsPage;
  let fixture: ComponentFixture<InstitutionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstitutionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
