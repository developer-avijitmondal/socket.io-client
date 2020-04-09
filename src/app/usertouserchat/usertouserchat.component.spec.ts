import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsertouserchatComponent } from './usertouserchat.component';

describe('UsertouserchatComponent', () => {
  let component: UsertouserchatComponent;
  let fixture: ComponentFixture<UsertouserchatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsertouserchatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsertouserchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
