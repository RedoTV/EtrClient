import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestTableComponent } from './contest-table.component';

describe('ContestTableComponent', () => {
  let component: ContestTableComponent;
  let fixture: ComponentFixture<ContestTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContestTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContestTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
