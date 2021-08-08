import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowsFeedComponent } from './follows-feed.component';

describe('FollowsFeedComponent', () => {
  let component: FollowsFeedComponent;
  let fixture: ComponentFixture<FollowsFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowsFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowsFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
