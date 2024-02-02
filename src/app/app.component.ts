import { Component, Renderer2, inject } from '@angular/core';
import { SortingService } from './core/services/sorting.service';
import {
  AnimationQueue,
  SortingAnimation,
} from '@matteo-l-tommasi/sorting-algorithms';
import { BubbleSortingComponent } from './components/bubble-sorting/bubble-sorting.component';
import { InsertionSortingComponent } from './components/insertion-sorting/insertion-sorting.component';
import { SelectionSortingComponent } from './components/selection-sorting/selection-sorting.component';
import { SettingsComponent } from './components/settings/settings.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    BubbleSortingComponent,
    InsertionSortingComponent,
    SelectionSortingComponent,
    SettingsComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-sorting-algo-visualizer';
  sortingService = inject(SortingService);

 
  createSequence() {
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
  reset(){
    this.sortingService.resetSorting();
  }

  bubbleSortAnimationQueue: AnimationQueue = [];
  insetionSortAnimationQueue: AnimationQueue = [];
  selectionSortAnimationQueue: AnimationQueue = [];

  animationQueue: AnimationQueue = [];

  createAnimations() {
    this.sortingService.createSortingAnimation();
    this.bubbleSortAnimationQueue =
      this.sortingService.bubbleSortAnimationQueue;
    // this.insetionSortAnimationQueue =
    //   this.sortingService.insertionSortAnimationQueue;
    // this.selectionSortAnimationQueue =
    //   this.sortingService.selectionSortAnimationQueue;
  }
}
