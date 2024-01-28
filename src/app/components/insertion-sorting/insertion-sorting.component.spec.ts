import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertionSortingComponent } from './insertion-sorting.component';

describe('InsertionSortingComponent', () => {
  let component: InsertionSortingComponent;
  let fixture: ComponentFixture<InsertionSortingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertionSortingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsertionSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
