import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeforcesLinkComponent } from './codeforces-link.component';

describe('CodeforcesLinkComponent', () => {
  let component: CodeforcesLinkComponent;
  let fixture: ComponentFixture<CodeforcesLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeforcesLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CodeforcesLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
