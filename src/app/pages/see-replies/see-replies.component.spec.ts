import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeRepliesComponent } from './see-replies.component';

describe('SeeRepliesComponent', () => {
  let component: SeeRepliesComponent;
  let fixture: ComponentFixture<SeeRepliesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeRepliesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeRepliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
