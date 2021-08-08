import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WritePageComponent } from './write-page.component';

describe('WritePageComponent', () => {
  let component: WritePageComponent;
  let fixture: ComponentFixture<WritePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WritePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WritePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
