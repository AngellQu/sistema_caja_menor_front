import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppIngresoHospedajeComponent } from './app-ingreso-hospedaje.component';

describe('AppIngresoHospedajeComponent', () => {
  let component: AppIngresoHospedajeComponent;
  let fixture: ComponentFixture<AppIngresoHospedajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppIngresoHospedajeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppIngresoHospedajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
