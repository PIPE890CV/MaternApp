import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginMedicoPage } from './login-medico.page';

describe('LoginMedicoPage', () => {
  let component: LoginMedicoPage;
  let fixture: ComponentFixture<LoginMedicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginMedicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
