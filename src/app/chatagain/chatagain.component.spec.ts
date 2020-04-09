import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatagainComponent } from './chatagain.component';

describe('ChatagainComponent', () => {
  let component: ChatagainComponent;
  let fixture: ComponentFixture<ChatagainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatagainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatagainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
