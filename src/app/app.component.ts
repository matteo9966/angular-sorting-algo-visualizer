import { Component, Renderer2, inject } from '@angular/core';
import { SortingService } from './core/services/sorting.service';
import {
  AnimationQueue,
  SortingAnimation,
} from '@matteo-l-tommasi/sorting-algorithms';
import { BubbleSortingComponent } from './components/bubble-sorting/bubble-sorting.component';
import { InsertionSortingComponent } from './components/insertion-sorting/insertion-sorting.component';
import { SelectionSortingComponent } from './components/selection-sorting/selection-sorting.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    BubbleSortingComponent,
    InsertionSortingComponent,
    SelectionSortingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-sorting-algo-visualizer';
  sortingService = inject(SortingService);
  value = this.sortingService.value;
  changeValue() {
    console.log(this.value, this.sortingService.value);
    this.sortingService.changeValue();
    // console.log(this.value.val);
  }
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
  selectionSortAnimationQueue: AnimationQueue = [];

  animationQueue: AnimationQueue = [];
  sortingType: SortingAnimation['sortType'] | null = null;
  createBubbleSortSequence() {
    // this.animationQueue = this.sortingService.createBubbleSortAnimation();
    this.sortingType = 'bubble-sort';
  }

  createInsertionSortSequence() {
    // this.animationQueue = this.sortingService.createInsertionSortAnimation();
    this.sortingType = 'insertion-sort';
  }

  createSelectionSortSequence() {
    // this.animationQueue = this.sortingService.createSelectionSortAnimation();
    this.sortingType = 'selection-sort';
  }

  createAnimations() {
    this.sortingService.createSortingAnimation();
    this.bubbleSortAnimationQueue=this.sortingService.bubbleSortAnimationQueue;
    this.insetionSortAnimationQueue=this.sortingService.insertionSortAnimationQueue;
    this.selectionSortAnimationQueue=this.sortingService.selectionSortAnimationQueue;
  }
}
