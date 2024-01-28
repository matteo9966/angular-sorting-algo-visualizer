import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleSortingComponent } from './bubble-sorting.component';

describe('BubbleSortingComponent', () => {
  let component: BubbleSortingComponent;
  let fixture: ComponentFixture<BubbleSortingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BubbleSortingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BubbleSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
