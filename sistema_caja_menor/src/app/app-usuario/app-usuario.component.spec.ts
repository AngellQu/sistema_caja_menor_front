import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUsuarioComponent } from './app-usuario.component';

describe('AppUsuarioComponent', () => {
  let component: AppUsuarioComponent;
  let fixture: ComponentFixture<AppUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
