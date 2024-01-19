import { Directive, ElementRef, Renderer2, ViewContainerRef, inject } from '@angular/core';
import { SortingService } from '../services/sorting.service';

@Directive({
  selector: '[appBubbleSort]',
  standalone: true,
})
export class BubbleSortDirective {
  renderer = inject(Renderer2);
  sortingService = inject(SortingService);
  constructor(private container: ElementRef<HTMLDivElement>) {
    
  }
}
