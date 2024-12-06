import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppHuespedComponent } from './app-huesped.component';

describe('AppHuespedComponent', () => {
  let component: AppHuespedComponent;
  let fixture: ComponentFixture<AppHuespedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppHuespedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppHuespedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
