import { TestBed } from '@angular/core/testing';

import { TrackInfoControlService } from './track-info-control.service';

describe('TrackInfoControlService', () => {
  let service: TrackInfoControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackInfoControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
