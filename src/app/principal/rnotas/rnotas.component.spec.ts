import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RnotasComponent } from './rnotas.component';

describe('RnotasComponent', () => {
  let component: RnotasComponent;
  let fixture: ComponentFixture<RnotasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RnotasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RnotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
