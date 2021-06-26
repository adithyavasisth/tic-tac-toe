import { TestBed } from '@angular/core/testing';

import { IsHandsetService } from './is-handset.service';

describe('IsHandsetService', () => {
  let service: IsHandsetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsHandsetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
