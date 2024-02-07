import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemsTreeComponent } from './problems-tree.component';

describe('ProblemsTreeComponent', () => {
  let component: ProblemsTreeComponent;
  let fixture: ComponentFixture<ProblemsTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProblemsTreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProblemsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
