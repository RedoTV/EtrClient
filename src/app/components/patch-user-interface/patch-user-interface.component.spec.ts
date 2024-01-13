import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatchUserInterfaceComponent } from './patch-user-interface.component';

describe('PatchUserInterfaceComponent', () => {
  let component: PatchUserInterfaceComponent;
  let fixture: ComponentFixture<PatchUserInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatchUserInterfaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatchUserInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
