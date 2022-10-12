import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrackInfoComponent } from './track-info.component';

describe('TrackInfoComponent', () => {
  let component: TrackInfoComponent;
  let fixture: ComponentFixture<TrackInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
