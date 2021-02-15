import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormLibComponent } from './dynamic-form-lib.component';

describe('DynamicFormLibComponent', () => {
  let component: DynamicFormLibComponent;
  let fixture: ComponentFixture<DynamicFormLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
