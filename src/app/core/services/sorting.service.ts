import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Actions } from '../../types/actions';
// import { bubbleSortRecursive, } from '@matteo-l-tommasi/sorting-algorithms';
import { TickService } from './tick.service';
import {
  bubbleSort,
  insertionSort,
} from '@matteo-l-tommasi/sorting-algorithms';

@Injectable({
  providedIn: 'root',
})
export class SortingService {
  private tickService = inject(TickService);
  tick$ = this.tickService.tick$;

  private sortingStatus$$ = new BehaviorSubject<Actions>('pause');
  constructor() {}

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
  createSequence(size = 30, min = 1, max = 200) {
    const random: number[] = [];
    for (let i = 0; i < size; i++) {
      random.push(randomInteger(min, max));
    }
    return random;
  }

  createBubbleSortAnimation() {
    const sequence = this.createSequence();
    return bubbleSort(sequence);
  }

  createInsertionSortAnimation() {
    const sequence = this.createSequence();
    return insertionSort(sequence);
    // return mock
  }
}

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
