import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptsFeedComponent } from './prompts-feed.component';

describe('PromptsFeedComponent', () => {
  let component: PromptsFeedComponent;
  let fixture: ComponentFixture<PromptsFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptsFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptsFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
