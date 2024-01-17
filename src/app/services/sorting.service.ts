import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Actions } from '../types/actions';

@Injectable({
  providedIn: 'root',
})
export class SortingService {
  private sortingStatus$$ = new BehaviorSubject<Actions>(
    'pause'
  );
  constructor() {}
  changeStatus(newStatus: Actions) {
    this.sortingStatus$$.next(newStatus);
  }

  status$ = this.sortingStatus$$.asObservable();

  playSorting() {
    this.sortingStatus$$.next('play');
  }

  pauseSorting() {
    this.sortingStatus$$.next('pause');
  }

  resetSorting(){
    this.sortingStatus$$.next('reset')
  }
}
