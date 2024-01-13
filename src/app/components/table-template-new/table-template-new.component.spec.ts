import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTemplateNewComponent } from './table-template-new.component';

describe('TableTemplateNewComponent', () => {
  let component: TableTemplateNewComponent;
  let fixture: ComponentFixture<TableTemplateNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableTemplateNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableTemplateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
