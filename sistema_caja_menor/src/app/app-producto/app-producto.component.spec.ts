import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppProductoComponent } from './app-producto.component';

describe('AppProductoComponent', () => {
  let component: AppProductoComponent;
  let fixture: ComponentFixture<AppProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
