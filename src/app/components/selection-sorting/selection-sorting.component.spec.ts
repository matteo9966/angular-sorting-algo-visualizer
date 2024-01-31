import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionSortingComponent } from './selection-sorting.component';

describe('SelectionSortingComponent', () => {
  let component: SelectionSortingComponent;
  let fixture: ComponentFixture<SelectionSortingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionSortingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectionSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
