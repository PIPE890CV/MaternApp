import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroMadrePage } from './registro-madre.page';

describe('RegistroMadrePage', () => {
  let component: RegistroMadrePage;
  let fixture: ComponentFixture<RegistroMadrePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroMadrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
