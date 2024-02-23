import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerSignupComponent } from './consumer-signup.component';

describe('ConsumerSignupComponent', () => {
  let component: ConsumerSignupComponent;
  let fixture: ComponentFixture<ConsumerSignupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumerSignupComponent]
    });
    fixture = TestBed.createComponent(ConsumerSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
