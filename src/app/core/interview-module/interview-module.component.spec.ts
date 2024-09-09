import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewModuleComponent } from './interview-module.component';

describe('InterviewModuleComponent', () => {
  let component: InterviewModuleComponent;
  let fixture: ComponentFixture<InterviewModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewModuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
