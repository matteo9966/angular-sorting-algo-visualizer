import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Actions } from '../../types/actions';
// import { bubbleSortRecursive, } from '@matteo-l-tommasi/sorting-algorithms';
import { TickService } from './tick.service';
import {
  BubbleSortAnimation,
  InsertionSortAnimation,
  bubbleSort,
  insertionSort,
  selectionSort,
} from '@matteo-l-tommasi/sorting-algorithms';
import { SelectionSortAnimation } from '@matteo-l-tommasi/sorting-algorithms/lib/es5/algorithms/selection-sort';

@Injectable({
  providedIn: 'root',
})
export class SortingService {
  private tickService = inject(TickService);
  tick$ = this.tickService.tick$;
  sortingSequence: number[] = [];
  bubbleSortAnimationQueue: BubbleSortAnimation[] = [];
  selectionSortAnimationQueue: SelectionSortAnimation[] = [];
  insertionSortAnimationQueue: InsertionSortAnimation[] = [];
  value = { val: 10 };
  val=10
  private sortingStatus$$ = new BehaviorSubject<Actions>('pause');
  constructor() {}

  changeValue() {
    this.value = { val: this.val};
    this.val++;
    console.log(this.val,this.value)
  }

  status$ = this.sortingStatus$$.asObservable();

  play() {
    this.tickService.play(500);
  }

  pause() {
    this.tickService.pause();
  }

  playSorting() {
    this.sortingStatus$$.next('play');
  }

  pauseSorting() {
    this.sortingStatus$$.next('pause');
  }

  resetSorting() {
    this.sortingStatus$$.next('reset');
  }

  sequence = signal<number[][]>([]);
  insertSequence(list: number[]) {}
  createSequence(size = 20, min = 10, max = 99) {
    const random: number[] = [];
    for (let i = 0; i < size; i++) {
      random.push(randomInteger(min, max));
    }
    return random;
  }

  createBubbleSortAnimation(sortingSequence: number[]) {
    return bubbleSort(sortingSequence);
  }

  createInsertionSortAnimation(sortingSequence: number[]) {
    return insertionSort(sortingSequence);
  }

  createSelectionSortAnimation(sortingSequence: number[]) {
    return selectionSort(sortingSequence);
  }

  createSortingAnimation() {
    this.sortingSequence = this.createSequence();
    this.bubbleSortAnimationQueue = this.createBubbleSortAnimation(
      [...this.sortingSequence]
    );
    this.insertionSortAnimationQueue = this.createInsertionSortAnimation(
      [...this.sortingSequence]
    );
    this.selectionSortAnimationQueue = this.createSelectionSortAnimation(
     [...this.sortingSequence]
    );
    console.log(
      this.bubbleSortAnimationQueue,
      this.insertionSortAnimationQueue,
      this.selectionSortAnimationQueue
    );
  }
}

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
