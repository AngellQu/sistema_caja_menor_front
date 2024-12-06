import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRetiranteComponent } from './app-retirante.component';

describe('AppRetiranteComponent', () => {
  let component: AppRetiranteComponent;
  let fixture: ComponentFixture<AppRetiranteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppRetiranteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppRetiranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
