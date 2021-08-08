import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStoryComponent } from './admin-story.component';

describe('AdminStoryComponent', () => {
  let component: AdminStoryComponent;
  let fixture: ComponentFixture<AdminStoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminStoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
