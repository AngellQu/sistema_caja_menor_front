import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSesionComponent } from './app-sesion.component';

describe('AppSesionComponent', () => {
  let component: AppSesionComponent;
  let fixture: ComponentFixture<AppSesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSesionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
