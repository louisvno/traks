import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoVideoComponent } from './no-video.component';

describe('NoVideoComponent', () => {
  let component: NoVideoComponent;
  let fixture: ComponentFixture<NoVideoComponent>;

  beforeEach(async(() => {
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
