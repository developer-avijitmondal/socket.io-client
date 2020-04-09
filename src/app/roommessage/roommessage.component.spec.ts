import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoommessageComponent } from './roommessage.component';

describe('RoommessageComponent', () => {
  let component: RoommessageComponent;
  let fixture: ComponentFixture<RoommessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoommessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoommessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
