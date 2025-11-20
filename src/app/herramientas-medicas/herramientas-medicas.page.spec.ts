import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HerramientasMedicasPage } from './herramientas-medicas.page';

describe('HerramientasMedicasPage', () => {
  let component: HerramientasMedicasPage;
  let fixture: ComponentFixture<HerramientasMedicasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HerramientasMedicasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
