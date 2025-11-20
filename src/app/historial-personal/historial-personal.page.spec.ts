import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialPersonalPage } from './historial-personal.page';

describe('HistorialPersonalPage', () => {
  let component: HistorialPersonalPage;
  let fixture: ComponentFixture<HistorialPersonalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialPersonalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
