import { TestBed } from '@angular/core/testing';

import { PlaySessionService } from './play-session.service';

describe('PlaySessionService', () => {
  let service: PlaySessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaySessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
