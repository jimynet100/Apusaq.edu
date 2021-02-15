import { TestBed } from '@angular/core/testing';

import { DynamicFormLibService } from './dynamic-form-lib.service';

describe('DynamicFormLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicFormLibService = TestBed.get(DynamicFormLibService);
    expect(service).toBeTruthy();
  });
});
