import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardMedicoPage } from './dashboard-medico.page';

describe('DashboardMedicoPage', () => {
  let component: DashboardMedicoPage;
  let fixture: ComponentFixture<DashboardMedicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMedicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
