import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginMadrePage } from './login-madre.page';

describe('LoginMadrePage', () => {
  let component: LoginMadrePage;
  let fixture: ComponentFixture<LoginMadrePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginMadrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
