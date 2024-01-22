import { Component, Renderer2, inject } from '@angular/core';

import { SortingComponent } from './components/sorting/sorting.component';
import { SortingService } from './services/sorting.service';
import { AnimationQueue,BubbleSortAnimation,InsertionSortAnimation,SortingAnimation } from '@matteo-l-tommasi/sorting-algorithms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ SortingComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-sorting-algo-visualizer';
  sortingService = inject(SortingService);

  animate() {
    // this.renderer.e
  }

  // sequence = [
  //   [20, 50, 10, 90, 15, 80, 75, 40],
  //   [20, 10, 50, 90, 15, 80, 75, 40],
  //   [20, 10, 50, 15, 90, 80, 75, 40],
  //   [20, 10, 50, 15, 80, 90, 75, 40],
  //   [20, 10, 50, 15, 80, 75, 90, 40],
  //   [20, 10, 50, 15, 80, 75, 40, 90],
  //   [10, 20, 50, 15, 80, 75, 40, 90],
  //   [10, 20, 15, 50, 80, 75, 40, 90],
  //   [10, 20, 15, 50, 75, 80, 40, 90],
  //   [10, 20, 15, 50, 75, 40, 80, 90],
  //   [10, 15, 20, 50, 75, 40, 80, 90],
  //   [10, 15, 20, 50, 40, 75, 80, 90],
  //   [10, 15, 20, 40, 50, 75, 80, 90],
  // ];

  // sequence = this.sortingService.sequence;

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
