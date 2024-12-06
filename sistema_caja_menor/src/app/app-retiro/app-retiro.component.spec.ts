import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRetiroComponent } from './app-retiro.component';

describe('AppRetiroComponent', () => {
  let component: AppRetiroComponent;
  let fixture: ComponentFixture<AppRetiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppRetiroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppRetiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
