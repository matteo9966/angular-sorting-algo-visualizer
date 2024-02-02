import { Injectable, inject, signal } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  interval,
  map,
  Subject,
  Subscription,
} from 'rxjs';
import { Actions } from '../../types/actions';
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
  #tick$$ = new Subject<number>();
  sortingSequence: number[] = [];
  bubbleSortAnimationQueue: BubbleSortAnimation[] = [];
  selectionSortAnimationQueue: SelectionSortAnimation[] = [];
  insertionSortAnimationQueue: InsertionSortAnimation[] = [];
  private sortingStatus$$ = new BehaviorSubject<Actions>('pause');
  playing = false;
  intervalSub: Subscription | null = null;
  status$ = this.sortingStatus$$.asObservable();

  tick$ = combineLatest([this.#tick$$, this.sortingStatus$$]).pipe(
    filter(([_, status]) => status !== 'pause'),

  );

  private playTick(timeMs: number) {
    if (this.playing) return;
    this.playing = true;

    this.intervalSub = interval(timeMs)
      .pipe(map(() => timeMs))
      .subscribe((t) => this.#tick$$.next(t));
  }

  private pauseTick() {
    if (!this.playing) return;
    this.intervalSub?.unsubscribe();
    this.intervalSub = null;
    this.playing = false;
  }

  play() {
    this.playTick(500);
    this.playSorting();
  }

  pause() {
    this.pauseTick();
    this.pauseSorting();
  }

  playSorting() {
    this.sortingStatus$$.next('play');
  }

  pauseSorting() {
    this.sortingStatus$$.next('pause');
  }

  resetSorting() {
    this.pauseTick();
    this.sortingStatus$$.next('reset');
  }

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
    this.bubbleSortAnimationQueue = this.createBubbleSortAnimation([
      ...this.sortingSequence,
    ]);
    this.insertionSortAnimationQueue = this.createInsertionSortAnimation([
      ...this.sortingSequence,
    ]);
    this.selectionSortAnimationQueue = this.createSelectionSortAnimation([
      ...this.sortingSequence,
    ]);
  }
}

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
