import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionFeedComponent } from './interaction-feed.component';

describe('InteractionFeedComponent', () => {
  let component: InteractionFeedComponent;
  let fixture: ComponentFixture<InteractionFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
