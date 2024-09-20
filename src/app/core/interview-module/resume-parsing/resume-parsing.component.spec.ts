import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeParsingComponent } from './resume-parsing.component';

describe('ResumeParsingComponent', () => {
  let component: ResumeParsingComponent;
  let fixture: ComponentFixture<ResumeParsingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeParsingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeParsingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
