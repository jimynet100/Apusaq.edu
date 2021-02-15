import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaCierreSesionComponent } from './alerta-cierre-sesion.component';

describe('AlertaCierreSesionComponent', () => {
  let component: AlertaCierreSesionComponent;
  let fixture: ComponentFixture<AlertaCierreSesionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertaCierreSesionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertaCierreSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
