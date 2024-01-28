import { Component, Renderer2, inject } from '@angular/core';

import { SortingComponent } from './components/sorting/sorting.component';
import { SortingService } from './core/services/sorting.service';
import { AnimationQueue,BubbleSortAnimation,InsertionSortAnimation,SortingAnimation } from '@matteo-l-tommasi/sorting-algorithms';
import { BubbleSortingComponent } from './components/bubble-sorting/bubble-sorting.component';
import { InsertionSortingComponent } from './components/insertion-sorting/insertion-sorting.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ SortingComponent,BubbleSortingComponent,InsertionSortingComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-sorting-algo-visualizer';
  sortingService = inject(SortingService);

  animate() {
    // this.renderer.e
  }

  createSequence() {
    //todo pass params
    this.sortingService.createSequence();
  }

  centralizedPlay() {
    this.sortingService.playSorting();
  }

  centralizedPause() {
    this.sortingService.pauseSorting();
  }
  centralizedReset() {
    this.sortingService.resetSorting();
  }

  tick$ = this.sortingService.tick$;

  play() {
    this.sortingService.play();
  }
  pause() {
    this.sortingService.pause();
  }

  bubbleSortAnimationQueue: AnimationQueue = [];
  insetionSortAnimationQueue: AnimationQueue = [];

  animationQueue: BubbleSortAnimation[] | InsertionSortAnimation[] = [];
  sortingType: SortingAnimation['sortType'] | null = null;
  createBubbleSortSequence() {
    this.animationQueue = this.sortingService.createBubbleSortAnimation();
    this.sortingType = 'bubble-sort';
  }

  createInsertionSortSequence() {
    this.animationQueue = this.sortingService.createInsertionSortAnimation();
    console.log(this.animationQueue);
    this.sortingType = 'insertion-sort';
  }
}
