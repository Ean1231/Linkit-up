import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PastPapersPage } from './past-papers.page';

describe('PastPapersPage', () => {
  let component: PastPapersPage;
  let fixture: ComponentFixture<PastPapersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastPapersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PastPapersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 