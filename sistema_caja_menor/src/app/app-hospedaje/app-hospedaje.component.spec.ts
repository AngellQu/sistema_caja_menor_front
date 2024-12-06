import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppHospedajeComponent } from './app-hospedaje.component';

describe('AppHospedajeComponent', () => {
  let component: AppHospedajeComponent;
  let fixture: ComponentFixture<AppHospedajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppHospedajeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppHospedajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
