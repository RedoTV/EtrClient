import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePickFilterComponent } from './table-pick-filter.component';

describe('TablePickFilterComponent', () => {
  let component: TablePickFilterComponent;
  let fixture: ComponentFixture<TablePickFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePickFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablePickFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
