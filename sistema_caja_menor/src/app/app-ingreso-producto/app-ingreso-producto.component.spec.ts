import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppIngresoProductoComponent } from './app-ingreso-producto.component';

describe('AppIngresoProductoComponent', () => {
  let component: AppIngresoProductoComponent;
  let fixture: ComponentFixture<AppIngresoProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppIngresoProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppIngresoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
