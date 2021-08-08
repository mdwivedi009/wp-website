import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriesFeedComponent } from './stories-feed.component';

describe('StoriesFeedComponent', () => {
  let component: StoriesFeedComponent;
  let fixture: ComponentFixture<StoriesFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoriesFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoriesFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
