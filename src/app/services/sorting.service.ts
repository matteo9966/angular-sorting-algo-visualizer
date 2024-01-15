import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SortingService {
  private sortingStatus$$ = new BehaviorSubject<'play' | 'pause'>('pause');
  constructor() {}
  changeStatus(newStatus: 'play' | 'pause') {
    this.sortingStatus$$.next(newStatus);
  }

  status$ = this.sortingStatus$$.asObservable();

  playSorting() {
    this.sortingStatus$$.next('play');
  }

  pauseSorting() {
    this.sortingStatus$$.next('pause');
  }
}
