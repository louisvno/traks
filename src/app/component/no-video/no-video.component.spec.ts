import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NoVideoComponent } from './no-video.component';

describe('NoVideoComponent', () => {
  let component: NoVideoComponent;
  let fixture: ComponentFixture<NoVideoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NoVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
