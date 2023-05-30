import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiImageComponent } from './poi-image.component';

describe('PoiImageComponent', () => {
  let component: PoiImageComponent;
  let fixture: ComponentFixture<PoiImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoiImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoiImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
